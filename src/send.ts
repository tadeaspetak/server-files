import fs from "node:fs";
import path from "node:path";

import AdmZip from "adm-zip";

import FormData from "form-data";
import fetch from "node-fetch";

import { settings } from "./settings";
import { encodeFilePath, getSourceRoot, log, walk } from "./utils";

const serverUrl = `${settings.sender.to}`;

const { source } = settings.sender;
const sourceRoot = getSourceRoot(source);
const sourcePaths = source.folders.map((folder) =>
  path.join(source.root, folder)
);

const authHeaders = { Authorization: settings.secret };

const send = async () => {
  const fileInfos = sourcePaths.flatMap((source) => walk(source, sourceRoot));

  if (fileInfos.length === 0) {
    log("No files found, exiting.");
    process.exit();
  }

  // attach files to the form data, encoding their relative paths in the `filename`
  // so they can be retrieved on the server
  const form = new FormData();
  for (const fileInfo of fileInfos) {
    form.append("files", fs.readFileSync(fileInfo.absolute), {
      filename: encodeFilePath(fileInfo.relative),
    });
  }

  // send it off
  log("Uploading files...");
  const res = await fetch(serverUrl, {
    method: "POST",
    body: form,
    headers: authHeaders,
  });
  log(`Response from the server: '${(await res.json()).message}'`);

  if (!res.ok) {
    process.exit();
  }

  for (const fileInfo of fileInfos) {
    fs.unlinkSync(fileInfo.absolute);
  }
  log("Deleted transferred files on the client.", true);
};

const request = async () => {
  // request data
  log("Requesting data from the server now...");
  const resDownload = await fetch(`${serverUrl}/download`, {
    method: "GET",
    headers: authHeaders,
  });

  const file = new AdmZip(await resDownload.buffer());
  file.extractAllTo(settings.sender.destination);
  log(`All files extracted to ${settings.sender.destination}.`, true);

  // signal deletion
  log("Signalling deletion is ok to the server.");
  const resDelete = await fetch(`${serverUrl}/download-delete`, {
    method: "GET",
    headers: authHeaders,
  });
  log(`Response from the server: '${(await resDelete.json()).message}'`, true);
};

(async () => {
  try {
    await send();
    await request();
  } catch (e) {
    console.error(e);
  }
})();

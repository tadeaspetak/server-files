import fs from "node:fs";
import path from "node:path";

import AdmZip from "adm-zip";

import FormData from "form-data";
import fetch from "node-fetch";

import { settings } from "./settings";
import { encodeFilePath, getRoot, walk } from "./utils";

const serverUrl = `${settings.sender.to}`;

const { source } = settings.sender;
const root = getRoot(source);
const sources = source.folders.map((folder) => path.join(source.root, folder));

const headers = { Authorization: settings.secret };

(async () => {
  try {
    const fileInfos = sources.flatMap((source) => walk(source, root));
    if (fileInfos.length === 0) {
      console.log("No files found, exiting.");
      process.exit();
    }

    // attach files to the form data
    const form = new FormData();
    for (const fileInfo of fileInfos) {
      form.append("files", fs.readFileSync(fileInfo.absolute), {
        filename: encodeFilePath(fileInfo.relative),
      });
    }

    // send it off
    console.log("Uploading files...");
    const res = await fetch(serverUrl, {
      method: "POST",
      body: form,
      headers,
    });
    console.log(`Response from the server: '${(await res.json()).message}'`);

    if (!res.ok) {
      process.exit();
    }

    for (const fileInfo of fileInfos) {
      fs.unlinkSync(fileInfo.absolute);
    }
    console.log("Deleted transferred files on the client.");
    console.log("-----");

    // request data
    console.log("Requesting data from the server now...");
    const resDownload = await fetch(`${serverUrl}/download`, {
      method: "GET",
      headers,
    });

    const file = new AdmZip(await resDownload.buffer());
    file.extractAllTo(settings.sender.destination);
    console.log(`All files extracted to ${settings.sender.destination}.`);
    console.log("-----");

    // signal deletion
    console.log("Signalling deletion is ok to the server.");
    const resDelete = await fetch(`${serverUrl}/download-delete`, {
      method: "GET",
      headers,
    });
    console.log(
      `Response from the server: '${(await resDelete.json()).message}'`
    );
  } catch (e) {
    console.error(e);
  }
})();

import fs from "node:fs";
import path from "node:path";

import AdmZip from "adm-zip";

import FormData from "form-data";
import fetch from "node-fetch";

import { settings } from "./settings";
import { getRoot, walk } from "./utils";

const serverUrl = `${settings.sender.to}`;

const { source } = settings.sender;
const root = getRoot(source);
const sources = source.folders.map((folder) => path.join(source.root, folder));

(async () => {
  try {
    const fileInfos = sources.flatMap((source) => walk(source, root));

    // attach files to the form data
    const form = new FormData();
    for (const fileInfo of fileInfos) {
      form.append(fileInfo.name, fileInfo.relative); // keep the relative paths first so it's available in the `body` on the server
      form.append("files", fs.readFileSync(fileInfo.absolute), {
        filepath: fileInfo.name,
      });
    }

    // send it off
    console.log("Uploading files...");
    const res = await fetch(serverUrl, { method: "POST", body: form });
    console.log(`Response from the server: '${(await res.json()).message}'`);

    for (const fileInfo of fileInfos) {
      fs.unlinkSync(fileInfo.absolute);
    }
    console.log("Deleted transferred files on the client.");
    console.log("-----");

    // request data
    console.log("Requesting data from the server now...");
    const uploaded = await fetch(`${serverUrl}/download`, { method: "GET" });

    const file = new AdmZip(await uploaded.buffer());
    file.extractAllTo(settings.sender.destination);
    console.log(`All files extracted to ${settings.sender.destination}.`);
    console.log("-----");

    // signal deletion
    console.log("Signalling deletion is ok to the server.");
    const resDel = await fetch(`${serverUrl}/download-delete`, {
      method: "GET",
    });
    console.log(`Response from the server: '${(await resDel.json()).message}'`);
  } catch (e) {
    console.error(e);
  }
})();

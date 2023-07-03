import fs from "node:fs";
import path from "node:path";

import FormData from "form-data";
import fetch from "node-fetch";

import { settings } from "./settings";

const serverUrl = `${settings.sender.to}:${settings.port}`;
const sourceDir = path.isAbsolute(settings.sender.source)
  ? settings.sender.source
  : path.join(__dirname, "..", settings.sender.source);

(async () => {
  try {
    // attach files to the form data
    const form = new FormData();
    form.append("date", new Date().toISOString());
    for (const file of fs.readdirSync(sourceDir)) {
      form.append("files", fs.readFileSync(path.join(sourceDir, file)), {
        filename: file,
      });
    }

    // send it off
    const res = await fetch(serverUrl, { method: "POST", body: form });
    console.log(await res.json());
  } catch (e) {
    console.error(e);
  }
})();

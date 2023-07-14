import fs from "node:fs";
import path from "node:path";
import express from "express";
import multer from "multer";

import AdmZip from "adm-zip";

import { settings } from "./settings";
import { getSourceRoot, log, walk } from "./utils";
import { destination, upload } from "./receive.multer";

const sourceRoot = getSourceRoot(settings.recipient.source);
const sourcePaths = settings.recipient.source.folders.map((folder) =>
  path.join(settings.recipient.source.root, folder)
);

const app = express();
app.use(express.json());

/**
 * Ensure the request has the correct auth header containing the right secret.
 */

const checkAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.headers["authorization"] === settings.secret) {
    next();
  } else {
    res.status(403).send({ message: "Incorrect authentication." });
  }
};

app.post(
  "/",
  checkAuth,
  (_, __, next) => {
    log(`Saving files to ${destination}...`);
    next();
  },
  upload.array("files"),
  (_, res) => {
    res.send({ message: `Saved files to ${destination}!` });
    log("... done!", true);
  }
);

app.get("/download", checkAuth, (req, res) => {
  log("Zipping files...");
  const zip = new AdmZip();
  sourcePaths
    .flatMap((source) => walk(source, sourceRoot))
    .forEach((fileInfo) => {
      zip.addLocalFile(fileInfo.absolute, path.dirname(fileInfo.relative));
    });
  res.writeHead(200, {
    "Content-Disposition": `attachment; filename="uploads.zip"`,
    "Content-Type": "application/zip",
  });
  res.end(zip.toBuffer());
  log("Sent the files to the client.", true);
});

app.get("/download-delete", checkAuth, (req, res) => {
  sourcePaths
    .flatMap((source) => walk(source, sourceRoot))
    .forEach((fileInfo) => fs.unlinkSync(fileInfo.absolute));
  log("Deleted files on the server.", true);
  res.send({ message: `Deleted files.` });
});

app.listen(settings.recipient.port, () => {
  log(`Server listening on port ${settings.recipient.port}.`);
});

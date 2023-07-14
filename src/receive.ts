import fs from "node:fs";
import path from "node:path";
import express from "express";
import multer from "multer";

import AdmZip from "adm-zip";

import { settings } from "./settings";
import { decodeFilePath, ensureDir, getRoot, walk } from "./utils";

const root = getRoot(settings.recipient.source);
const sources = settings.recipient.source.folders.map((folder) =>
  path.join(settings.recipient.source.root, folder)
);

// -- storage --
const destination = ensureDir(
  path.isAbsolute(settings.recipient.destination)
    ? settings.recipient.destination
    : path.join(__dirname, "..", settings.recipient.destination)
);

const storage = multer.diskStorage({
  destination: (_, file, callback) => {
    const dir = path.dirname(decodeFilePath(file.originalname));
    callback(null, ensureDir(path.join(destination, dir)));
  },
  filename: (_, file, callback) => {
    callback(null, path.basename(decodeFilePath(file.originalname)));
  },
});
const upload = multer({ storage });

// -- express --
const app = express();
app.use(express.json());

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

app.get("/", (req, res) => {
  res.send("Running!");
});

app.post("/", checkAuth, upload.array("files"), (req, res) => {
  console.log(`Saving files to ${destination}...`);
  res.send({ message: `Saved files to ${destination}!` });
  console.log("... done!");
  console.log("-----");
});

app.get("/download", checkAuth, (req, res) => {
  console.log("Zipping files...");
  const zip = new AdmZip();
  sources
    .flatMap((source) => walk(source, root))
    .forEach((fileInfo) =>
      zip.addLocalFile(fileInfo.absolute, fileInfo.relative)
    );
  res.writeHead(200, {
    "Content-Disposition": `attachment; filename="uploads.zip"`,
    "Content-Type": "application/zip",
  });
  res.end(zip.toBuffer());
  console.log("Sent the files to the client.");
  console.log("-----");
});

app.get("/download-delete", checkAuth, (req, res) => {
  sources
    .flatMap((source) => walk(source, root))
    .forEach((fileInfo) => fs.unlinkSync(fileInfo.absolute));
  console.log("Deleted files on the server.");
  console.log("-----");
  res.send({ message: `Deleted files.` });
});

app.listen(settings.recipient.port, () => {
  console.log(`Server listening on port ${settings.recipient.port}.`);
});

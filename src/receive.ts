import fs from "node:fs";
import path from "node:path";
import express from "express";
import multer from "multer";

import { settings } from "./settings";

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const destinationBase = ensureDir(
  path.isAbsolute(settings.recipient.storage)
    ? settings.recipient.storage
    : path.join(__dirname, "..", settings.recipient.storage)
);

const getDestinationFolder = (req: express.Request) =>
  req.body.date ? path.join(destinationBase, req.body.date) : destinationBase;

// initialise storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, ensureDir(getDestinationFolder(req)));
  },
  filename: (_, file, callback) => callback(null, file.originalname),
});
const upload = multer({ storage });

// express
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running!");
});

app.post("/", upload.array("files"), (req, res) => {
  const destination = getDestinationFolder(req);

  console.log(`Saving files to ${destination}...`);
  res.send({ message: `Saved files to ${destination}!` });
  console.log("... done!");
});

app.listen(settings.recipient.port, settings.recipient.ip, () => {
  console.log(`Server listening on port ${settings.recipient.port}.`);
});

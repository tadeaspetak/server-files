import path from "node:path";
import multer from "multer";

import { settings } from "../settings";
import { decodeFilePath, ensureDir } from "../utils";

export const destination = ensureDir(
  path.isAbsolute(settings.recipient.destination)
    ? settings.recipient.destination
    : path.join(__dirname, "..", settings.recipient.destination)
);

// the relative path to the file on the client (and therefore on the server)
// is encoded in the `originalname` using the `encodeFilePath` function
const storage = multer.diskStorage({
  destination: (_, file, callback) => {
    const dir = path.dirname(decodeFilePath(file.originalname));
    callback(null, ensureDir(path.join(destination, dir)));
  },
  filename: (_, file, callback) => {
    callback(null, path.basename(decodeFilePath(file.originalname)));
  },
});

export const upload = multer({ storage });

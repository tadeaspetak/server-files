import fs from "node:fs";
import path from "node:path";
import { Source } from "./types";

export interface FileInfo {
  absolute: string;
  name: string;
  relative: string;
}

/**
 * Traverse the entire directory.
 */

export const walk = function (directory: string, root: string) {
  var results: FileInfo[] = [];
  const fileList = fs.readdirSync(directory);

  var pending = fileList.length;
  if (!pending) return results;

  for (let fileName of fileList) {
    const filePath = path.resolve(directory, fileName);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath, root));
    } else {
      results.push({
        absolute: filePath,
        name: fileName,
        relative: path.relative(root, filePath),
      });
    }
  }

  return results;
};

/**
 * Get source root directory.
 */

export const getSourceRoot = (source: Source) =>
  path.isAbsolute(source.root)
    ? source.root
    : path.join(__dirname, "..", source.root);

/**
 * Ensure a directory exists.
 */

export const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

export const log = (value: string, end = false) => {
  console.log(value);
  if (end) {
    console.log("------");
  }
};

const FILE_PATH_REPLACEMENT = "#-#";
export const encodeFilePath = (filePath: string) =>
  filePath.replaceAll(path.sep, FILE_PATH_REPLACEMENT);
export const decodeFilePath = (filePath: string) =>
  filePath.replaceAll(FILE_PATH_REPLACEMENT, path.sep);

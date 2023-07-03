import { Settings } from "./src/types";

export const defaults: Settings = {
  port: "81",
  recipient: {
    storage: "./files/storage",
  },
  sender: {
    source: "./files/source",
    to: "http://localhost",
  },
};

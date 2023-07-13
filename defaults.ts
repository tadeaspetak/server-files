import { Settings } from "./src/types";

export const defaults: Settings = {
  recipient: {
    port: 80,
    storage: "./files/storage",
  },
  sender: {
    source: "./files/source",
    to: "http://localhost:80",
  },
};

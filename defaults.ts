import { Settings } from "./src/types";

export const defaults: Settings = {
  recipient: {
    port: 80,
    storage: "./files/storage",
    ip: "0.0.0.0",
  },
  sender: {
    source: "./files/source",
    to: "http://localhost:80",
  },
};

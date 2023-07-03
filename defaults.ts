import { Settings } from "./src/types";

export const defaults: Settings = {
  port: "80",
  recipient: {
    storage: "./storage",
  },
  sender: {
    source: "./source",
    to: "http://localhost:80",
  },
};

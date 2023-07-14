import { Settings } from "./src/types";

export const defaults: Settings = {
  secret: "something-s3cr3t",
  recipient: {
    port: 80,
    source: {
      root: "C:\\Data\\FTP",
      folders: ["BMX_BCC", "BMX_BPM", "BMX_hlaseni", "BMX_MAT"],
    },
    destination: "C:\\Data",
    // source: {
    //   root: "./files/server",
    //   folders: ["first", "second"],
    // },
    // destination: "./files/from-client",
  },
  sender: {
    source: {
      root: "C:\\Data",
      folders: ["BTP_doprava", "pohledavky_CZ"],
    },
    destination: "C:\\Data",
    to: "http://localhost:80",
    // source: {
    //   root: "./files/client",
    //   folders: ["client1", "client2"],
    // },
    // destination: "./files/from-server",
  },
};

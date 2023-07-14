import { defaults } from "../defaults";
import { Settings } from "./types";

// const parsed = minimist(process.argv.slice(2));
// export const settings: Settings = {
//   recipient: {
//     port: parsed.port?.toNumber() ?? defaults.recipient.port,
//     storage: parsed.storage ?? defaults.recipient.storage,
//   },
//   sender: {
//     source: parsed.source ?? defaults.sender.source,
//     to: parsed.to ?? defaults.sender.to,
//   },
// };

export const settings: Settings = { ...defaults };

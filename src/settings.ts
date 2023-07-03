import minimist from "minimist";

const parsed = minimist(process.argv.slice(2));

export const settings: {
  dest: string;
  host: string;
  port: string;
  source: string;
} = {
  dest: parsed.dest ?? "../uploaded",
  host: parsed.host ?? "http://localhost",
  port: parsed.port ?? "80",
  source: parsed.source ?? "../to-send",
} as const;

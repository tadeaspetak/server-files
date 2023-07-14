export interface Source {
  root: string;
  folders: string[];
}

export type Settings = {
  secret: string;
  recipient: {
    port: number;
    source: Source;
    destination: string;
  };
  sender: {
    source: Source;
    destination: string;
    to: string;
  };
};

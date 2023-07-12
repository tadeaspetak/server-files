export type Settings = {
  recipient: {
    port: number;
    storage: string;
    ip: string;
  };
  sender: {
    source: string;
    to: string;
  };
};

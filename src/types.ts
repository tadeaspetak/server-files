export type Settings = {
  recipient: {
    port: number;
    storage: string;
  };
  sender: {
    source: string;
    to: string;
  };
};

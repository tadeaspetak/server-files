export type Settings = {
  recipient: {
    port: string;
    storage: string;
  };
  sender: {
    source: string;
    to: string;
  };
};

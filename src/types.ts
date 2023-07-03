export type Settings = {
  port: string;
  recipient: {
    storage: string;
  };
  sender: {
    source: string;
    to: string;
  };
};

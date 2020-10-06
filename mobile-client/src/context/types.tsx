export type User = {
  userId: string;
  username: string;
  token: string;
};

export type Contact = {
  _id: number;
  username: string;
};

export type Chat = {
  _id: number;
  type: string;
  participants: Contact[],
  createDate: Date; 
  requestAccepted?: boolean;
  muted: false;
};



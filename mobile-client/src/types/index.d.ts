type User = {
  userId: string;
  username: string;
  token: string;
};

type Contact = {
  _id: number;
  username: string;
};

type Chat = {
  _id: number;
  type: string;
  participants: Contact[],
  createDate: Date; 
  requestAccepted?: boolean;
  muted: false;
};



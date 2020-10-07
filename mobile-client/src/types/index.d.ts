type TUser = {
  userId: string;
  username: string;
  token: string;
};

type TContact = {
  _id: number;
  username: string;
};

type TChat = {
  _id: number;
  type: string;
  participants: TContact[],
  createDate: Date; 
  requestAccepted?: boolean;
  muted: false;
  lastMessage: string;
  unreadMessagesCount: number;
};

type TSender = {
  _id: number;
  name: string;
  avatar?: string;
};

type TReply = {
  origMsgId: number;
  origMsgText: string;
  origMsgSender: string;
};

type TMessage = {
  _id: string;
  text: string;
  createDate: Date;
  sender: TSender;
  image?: string;
  admin?: boolean;
  delivered: boolean;
  read: boolean;
  reply?: TReply;
  deleted?: boolean;
};




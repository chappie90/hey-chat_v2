export type Sender = {
  _id: number;
  name: string;
  avatar?: string;
};

export type Reply = {
  origMsgId: number;
  origMsgText: string;
  origMsgSender: string;
};

export type TMessage = {
  _id: number;
  text: string;
  createDate: Date;
  sender: Sender;
  image?: string;
  admin?: boolean;
  delivered: boolean;
  read: boolean;
  reply?: Reply;
  deleted?: boolean;
};

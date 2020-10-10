export type TUser = {
  _id: number;
  username: string;
  pendingContacts: TContact[];
  contacts: TContact[];
  chats: TChat[];
  archivedChats: TChat[];
};

export type TContact = {
  _id: number;
  username: string;
  pending?: boolean;
  chatId?: number;
};

export type TChat = {
  _id: number;
  type: string;
  participants: TContact[],
  createDate: Date; 
  requestAccepted?: boolean;
  muted: false;
  lastMessage: string;
  unreadMessagesCount: number;
};

// Message
type TReply = {
  origMsgId: number;
  origMsgText: string;
  origMsgSender: string;
};

export type TMessage = {
  _id: string;
  chatId: number;
  text: string;
  createDate: Date;
  sender: string;
  image?: string;
  admin?: boolean;
  delivered: boolean;
  read: boolean;
  reply?: TReply;
  deleted?: boolean;
};



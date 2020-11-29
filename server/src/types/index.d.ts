// Extend global object
declare global {
  namespace NodeJS {
    interface Global {
      appRoot: string;
      apnProvider: any;
      firebaseAdmin: any;
    }
  }
}

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
  chatId?: string;
};

export type TChat = {
  _id: number;
  chatId: string;
  type: string;
  participants: TContact[],
  createDate: Date; 
  requestAccepted?: boolean;
  requester?: number;
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

type TLike = {
  likedByUser: boolean;
  likesCount: number;
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
  liked: TLike;
  reply?: TReply;
  deleted?: boolean;
};


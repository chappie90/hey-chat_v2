// Navigation
type AuthenticationStackParams = {
  Starter: undefined;
};

type MainStackParams = {
  Chats: undefined;
  Contacts: undefined;
  Profile: undefined;
};

type ChatsStackParams = {
  Chats: undefined;
  CurrentChat: {
    chatType: string;
    chatId: string;
    contactId?: number;
    contactName?: string;
    contactProfile?: string;
  };
};

type ContactsStackParams = {
  Contacts: undefined;
  CurrentChat: {
    chatType: string;
    chatId: string;
    contactId: number;
    contactName: string;
    contactProfile?: string;
  };
};

type TUser = {
  userId: number;
  username: string;
  token: string;
};

type TContact = {
  _id: number;
  username: string;
  chatId?: number;
  pending?: boolean;
};

type TChat = {
  chatId: string;
  type: string;
  participants: TContact[],
  createDate: Date; 
  requestAccepted?: boolean;
  muted: false;
  lastMessage: string;
  unreadMessagesCount: number;
};

// Message
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

type TLike = {
  likedByUser: boolean;
  likesCount: number;
};

type TMessage = {
  _id: string;
  chatId?: string;
  text: string;
  createDate: Date;
  sender: TSender;
  image?: string;
  admin?: boolean;
  delivered: boolean;
  read: boolean;
  liked: TLike;
  reply?: TReply;
  deleted?: boolean;
};

// Camera
type TCameraPhoto = {
  width: number;
  height: number;
  uri: string;
};



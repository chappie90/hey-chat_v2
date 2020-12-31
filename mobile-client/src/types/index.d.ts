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
  VideoCall: {
    chatType: string;
    chatId: string;
    contactId: number;
    contactName: string;
    contactProfile?: string;
  };
};

type ContactsStackParams = {
  Contacts: undefined;
  CurrentChat: {
    chatType: string;
    chatId: string | undefined;
    contactId: number;
    contactName: string;
    contactProfile?: string;
  };
  VideoCall: {
    chatType: string;
    chatId: string | undefined;
    contactId: number;
    contactName: string;
    contactProfile?: string;
  };
};

// User
type TUser = {
  userId: number;
  username: string;
  token: string;
};

type TUserProfile = {
  image?: {
    original?: {
      name: string;
      path: string;
    },  
    small?: {
      name: string;
    },
    medium?: {
      name: string;
      path: string;
    }
  }
};

type TContact = {
  _id: number;
  username: string;
  profile?: TUserProfile;
  chatId?: string;
  pending?: boolean;
  online: boolean;
};

type TChat = {
  _id: number;
  chatId: string;
  type: string;
  participants: TContact[],
  createDate: Date; 
  requestAccepted?: boolean;
  muted: boolean;
  lastMessage: TLastChatMessage;
  unreadMessagesCount: number;
};

// Message
type TSender = {
  _id: number;
  name: string;
  avatar?: string;
};

type TReply = {
  origMsgId?: string;
  origMsgText?: string;
  origMsgSender?: string;
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

type TLastChatMessage = {
  message: { text: string };
  sender: string;
  read: boolean;
};

// Camera
type TCameraPhoto = {
  width: number;
  height: number;
  uri: string;
  filename?: string;
};



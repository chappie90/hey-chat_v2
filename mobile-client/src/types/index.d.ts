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
    contactId: number;
    contactName: string;
    contactProfile: { small: string, medium: string };
  };
  Call: undefined;
};

type ContactsStackParams = {
  Contacts: undefined;
  CurrentChat: {
    chatType: string;
    chatId: string | undefined;
    contactId: number;
    contactName: string;
    contactProfile: { small: string, medium: string };
  };
  Call: undefined;
};

// User
type TUser = {
  _id: number | null;
  username: string;
  authToken: string;
  avatar?: {
    small: string;
    medium: string;
  };
};

type TContact = {
  _id: number;
  username: string;
  avatar?: {
    small?: string;
    medium?: string;
  };
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
  online?: boolean;
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
  admin: boolean;
};

// Camera
type TCameraPhoto = {
  width: number;
  height: number;
  uri: string;
  filename?: string;
};

// Call
type TCall = {
  callId: string;
  isActive: boolean;
  isInitiatingCall: boolean;
  isReceivingCall: boolean;
  hasEnded: boolean;
  offer: any,
  chat: { 
    chatType: string;
    chatId: string;
  };
  caller: TContact;
  callee: TContact;
  RTCConnection: any | null;
  localStream: any | null;
  remoteStream: any | null;
  type: string; // audio or video
  localVideoEnabled: boolean;
  remoteVideoEnabled: boolean;
  muted: boolean;
  cameraFacingMode: string; // front or back
  speaker: boolean;
};



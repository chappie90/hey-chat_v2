type TUser = {
  _id: number;
  username: string;
  pendingContacts: TContact[];
  contacts: TContact[];
  chats: TChat[];
  archivedChats: TChat[];
};

type TContact = {
  _id: number;
  username: string;
  pending?: boolean;
  chatId?: number;
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




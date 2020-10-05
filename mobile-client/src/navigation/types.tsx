export type AuthenticationStackParams = {
  Starter: undefined;
};

export type MainStackParams = {
  Chats: undefined;
  Contacts: undefined;
  Profile: undefined;
};

export type ChatsStackParams = {
  Chats: undefined;
  CurrentChat: {
    chatType: string;
    username: string;
  };
};

export type ContactsStackParams = {
  Contacts: undefined;
  CurrentChat: {
    chatType: string;
    username: string;
  };
};
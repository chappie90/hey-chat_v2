import { Dispatch } from 'redux';

import { contactsActions, chatsActions } from 'reduxStore/actions';

const onGetContacts = (data: string, dispatch: Dispatch) => {
  const { contacts } = JSON.parse(data);
  dispatch(contactsActions.getContacts(contacts));
  dispatch(contactsActions.markContactsAsFetched());
};

const onGetOnlineContacts = (data: string, dispatch: Dispatch) => {
  const { onlineContacts } = JSON.parse(data);

  dispatch(contactsActions.getOnlineContacts(onlineContacts));

  dispatch(chatsActions.setOnlineContacts(onlineContacts));
};

const onContactIsOnline = (data: string, userId: number, dispatch: Dispatch) => {
  const { user } = JSON.parse(data);
        
  // If contact pending mark as such
  const isPending = user.pendingContacts.some((contact: TContact) => contact._id === userId);
  user.pending = isPending;

  // Get id of chat between user and contact
  const chats = [ ...user.chats, ...user.deletedChats ];
  const chatId: string = chats.filter(chat => chat.participants.filter((p: any) => p === userId))[0].chatId;
  user.chatId = chatId;

  user.online = true;

  dispatch(contactsActions.contactGoesOnline(user));

  dispatch(chatsActions.contactGoesOnline(user));
};

const onContactIsOffline = (userId: string, dispatch: Dispatch) => {
  dispatch(contactsActions.contactGoesOffline(userId));

  dispatch(chatsActions.contactGoesOffline(userId))
};

const onContactIsTyping = (contactId: string, dispatch: Dispatch) => {
  dispatch(chatsActions.contactIsTyping(contactId));
};

const onContactStoppedTyping = (contactId: string, dispatch: Dispatch) => {
  dispatch(chatsActions.contactStoppedTyping(contactId));
};

const onProfileImageUpdated = (data: string, dispatch: Dispatch) => {
  const { userId, profileImage } = JSON.parse(data);
  dispatch(contactsActions.updateContactAvatar(userId, profileImage));
  dispatch(chatsActions.updateContactAvatar(userId, profileImage));
};

export default {
  onGetContacts,
  onGetOnlineContacts,
  onContactIsOnline,
  onContactIsOffline,
  onContactIsTyping,
  onContactStoppedTyping,
  onProfileImageUpdated
};
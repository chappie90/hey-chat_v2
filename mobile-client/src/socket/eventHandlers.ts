import { Dispatch } from 'redux';

import { authActions, contactsActions, chatsActions } from 'reduxStore/actions';
import { emitMarkAllMessagesAsRead } from './eventEmitters';

const onGetContacts = (data: string, dispatch: Dispatch) => {
  const { contacts } = JSON.parse(data);
  dispatch(contactsActions.getContacts(contacts));
  dispatch(contactsActions.markContactsAsFetched());
};

const onGetOnlineContacts = (data: string, dispatch: Dispatch) => {
  const { onlineContacts } = JSON.parse(data);
  dispatch(contactsActions.getOnlineContacts(onlineContacts));
};

const onFirstMessageSent = (data: string, dispatch: Dispatch) => {
  const { newChat, newMessage } = JSON.parse(data);
  dispatch(chatsActions.markMessageAsDelivered(newChat.chatId, newMessage.message.id));
  const chat = { ...newChat, lastMessage: newMessage };
  dispatch(chatsActions.addChat(chat));
};

const onFirstMessageReceived = (data: string, dispatch: Dispatch) => {
  const { newChat, newMessage } = JSON.parse(data);
  const chat = { ...newChat, lastMessage: newMessage };
  dispatch(chatsActions.addChat(chat));
};

const onMessageSent = (data: string, dispatch: Dispatch) => {
  const { chat, newMessage } = JSON.parse(data);
  dispatch(chatsActions.markMessageAsDelivered(chat.chatId, newMessage.message.id));
  const updatedChat = { ...chat, lastMessage: newMessage };
  dispatch(chatsActions.updateChat(updatedChat));
};

const onMessageReceived = async (
  data: string, 
  username: string,
  chatHistory: any,
  dispatch: Dispatch, 
  socketState = null, 
  currentScreen = ''
) => {
  const { chat, newMessage, newTMessage, senderId, unreadMessagesCount } = JSON.parse(data);
        
  const updatedChat = { 
    ...chat, 
    lastMessage: newMessage,
    unreadMessagesCount: unreadMessagesCount
  };
  dispatch(chatsActions.updateChat(updatedChat));
  dispatch(chatsActions.contactStoppedTyping(senderId));

  // Fetch chat messages if not loaded yet
  if (!chatHistory[chat.chatId]) {
    await dispatch(chatsActions.getMessages(username, '', chat.chatId));
  } else {
    // Append last message if chat loaded
    dispatch(chatsActions.addMessage(
      newMessage.chatId, 
      {
        ...newTMessage,
        sender: {
          ...newTMessage.sender,
          _id: 2
        },
        delivered: true,
        read: true
      }
    ));
  }

  // If recipient is active on current chat screen, send signal to sender message has been read
  // and mark recipient's chat as read
  if (currentScreen === 'CurrentChat') {
    dispatch(chatsActions.markMessagesAsReadRecipient(newMessage.chatId));
    const eventData = { chatId: newMessage.chatId, senderId };
    emitMarkAllMessagesAsRead(JSON.stringify(eventData), socketState);
  }
};

const onMessagesMarkedAsReadSender = (data: string, dispatch: Dispatch) => {
  const { chatId } = JSON.parse(data);
  dispatch(chatsActions.markMessagesAsReadSender(chatId));
};

const onMessageLiked = (data: string, dispatch: Dispatch) => {
  const { chatId, messageId } = JSON.parse(data);
  dispatch(chatsActions.likeMessage(chatId, messageId));
};

const onMessageDeleted = (data: string, dispatch: Dispatch) => {
  const { chatId, messageId } = JSON.parse(data);
  dispatch(chatsActions.deleteMessage(chatId, messageId));
};

const onProfileImageUpdated = (data: string, dispatch: Dispatch) => {
  const { userId, profileImage } = JSON.parse(data);
  console.log('inside profile event listener');
  console.log(userId);
  console.log(profileImage);
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
};

const onContactIsOffline = (userId: string, dispatch: Dispatch) => {
  dispatch(contactsActions.contactGoesOffline(userId));
};

const onContactIsTyping = (contactId: string, dispatch: Dispatch) => {
  dispatch(chatsActions.contactIsTyping(contactId));
};

const onContactStoppedTyping = (contactId: string, dispatch: Dispatch) => {
  dispatch(chatsActions.contactStoppedTyping(contactId));
};

const onUserConnected = (dispatch: Dispatch) => {
  dispatch(authActions.setUserConnectionState(true));
};

export default {
  onGetContacts,
  onGetOnlineContacts,
  onFirstMessageSent,
  onFirstMessageReceived,
  onMessageSent,
  onMessageReceived,
  onMessagesMarkedAsReadSender,
  onMessageLiked,
  onMessageDeleted,
  onProfileImageUpdated,
  onContactIsOnline,
  onContactIsOffline,
  onContactIsTyping,
  onContactStoppedTyping,
  onUserConnected
};
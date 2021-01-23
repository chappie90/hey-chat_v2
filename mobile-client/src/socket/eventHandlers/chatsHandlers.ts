import { Dispatch } from 'redux';

import { chatsActions, contactsActions } from 'reduxStore/actions';
import { emitMarkAllMessagesAsRead } from 'socket/eventEmitters';

const onFirstMessageSent = (data: string, dispatch: Dispatch) => {
  const { newChat, newMessage, pendingContact } = JSON.parse(data);
  dispatch(chatsActions.markMessageAsDelivered(newChat.chatId, newMessage.message.id));
  const chat = { ...newChat, lastMessage: newMessage };
  dispatch(chatsActions.addChat(chat));
  dispatch(contactsActions.addPendingContact(pendingContact));
};

const onFirstMessageReceived = (data: string, dispatch: Dispatch) => {
  const { newChat, newMessage } = JSON.parse(data);
  const chat = { ...newChat, lastMessage: newMessage, unreadMessagesCount: 1 };
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

const onChatRestored = (data: string, dispatch: Dispatch) => {
  const { chat, newMessage } = JSON.parse(data);
  const restoredChat = { ...chat, lastMessage: newMessage };
  dispatch(chatsActions.addChat(restoredChat));
};

export default {
  onFirstMessageSent,
  onFirstMessageReceived,
  onMessageSent,
  onMessageReceived,
  onMessagesMarkedAsReadSender,
  onMessageLiked,
  onMessageDeleted,
  onChatRestored
};
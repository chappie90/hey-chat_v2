import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type ChatsState = {
  chats: TChat[] | [];
  chatHistory: { 
    [key: string]: { messages: TMessage[], allMessagesLoaded: boolean }
  } | {};
};

type ChatsAction =
  | { type: 'get_chats'; payload: TChat[] }
  | { type: 'add_chat'; payload: TChat }
  | { type: 'update_chat'; payload: TChat }
  | { type: 'get_messages'; payload: { chatId: string, messages: TMessage[], allMessagesLoaded: boolean } }
  | { type: 'get_more_messages'; payload: { chatId: string, messages: TMessage[], allMessagesLoaded: boolean } }
  | { type: 'add_message'; payload: { chatId: string, message: TMessage } }
  | { type: 'like_message'; payload: { chatId: string, messageId: string } }
  | { type: 'mark_message_for_deletion'; payload: { chatId: string, messageId: string } }
  | { type: 'delete_message'; payload: { chatId: string, messageId: string } }
  | { type: 'mark_message_as_delivered'; payload: { chatId: string, messageId: string } }
  | { type: 'mark_messages_as_read_sender'; payload: { chatId: string } }
  | { type: 'mark_messages_as_read_recipient'; payload: { chatId: string } };

const getChats = (userId: number) => async (dispatch: ThunkDispatch<ChatsState, undefined, ChatsAction>) => {
  const params = { userId };

  try {
    const response = await api.get('/chats', { params });
    const chats: TChat[] = response.data.chats.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

    dispatch({ type: 'get_chats', payload: chats });

    return chats;
  } catch (error) {
    console.log('Get chats method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};

const addChat = (chat: TChat) => ({ type: 'add_chat', payload: chat });

const updateChat = (chat: TChat) => ({ type: 'update_chat', payload: chat });

const getMessages = (
  username: string, 
  contactProfile: string, 
  chatId: string
) => async (dispatch: ThunkDispatch<ChatsState, undefined, ChatsAction>) => {
  const params = { chatId };

  try {
    const response = await api.get('/messages', { params });

    const messages: TMessage[] = transformMessagesArray(response.data.messages, username, contactProfile, chatId);

    dispatch({ type: 'get_messages', payload: { 
      chatId, 
      messages, 
      allMessagesLoaded: response.data.allMessagesLoaded
    } });

    return messages;
  } catch (error) {
    console.log('Get messages method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  } 
};

const getMoreMessages = (
  username: string, 
  contactProfile: string, 
  chatId: string,
  page: number
  ) => async (dispatch: ThunkDispatch<ChatsState, undefined, ChatsAction>) => {
  const params = { chatId, page };

  try {
    const response = await api.get('/messages/more', { params });

    const messages: TMessage[] = transformMessagesArray(response.data.messages, username, contactProfile, chatId);

    dispatch({ type: 'get_more_messages', payload: { 
      chatId, 
      messages, 
      allMessagesLoaded: response.data.allMessagesLoaded
    } });

    return messages;
  } catch (error) {
    console.log('Get messages method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  } 
};

const addMessage = (chatId: string, message: TMessage) => ({ type: 'add_message', payload: { chatId, message } });

const likeMessage = (chatId: string, messageId: string) => ({ type: 'like_message', payload: { chatId, messageId } });

const markMessageForDeletion = (chatId: string, messageId: string) => ({ type: 'mark_message_for_deletion', payload: { chatId, messageId } });

const deleteMessage = (chatId: string, messageId: string) => ({ type: 'delete_message', payload: { chatId, messageId } });

const markMessageAsDelivered = (chatId: string, messageId: string) => ({ type: 'mark_message_as_delivered', payload: { chatId, messageId } });

const markMessagesAsReadSender = (chatId: string) => ({ type: 'mark_messages_as_read_sender', payload: { chatId } });

const markMessagesAsReadRecipient = (chatId: string) => ({ type: 'mark_messages_as_read_recipient', payload: { chatId } });

const transformMessagesArray = (
  messages: any[], 
  username: string, 
  contactProfile: string, 
  chatId: string
): TMessage[] => {
  return messages.map((message: any) => {
    const { 
      message: { id, text, createDate }, 
      sender, 
      image, 
      admin, 
      delivered, 
      read, 
      liked, 
      reply,
      deleted
    } = message;

    return {
      _id: id,
      chatId,
      text,
      createDate,
      sender: {
        _id: sender === username ? 1 : 2,
        name: sender,
        avatar: sender === username ? undefined : contactProfile
      },
      image: image?.name,
      admin,
      delivered,
      read,
      liked: {
        likedByUser: liked.likedByUser,
        likesCount: liked.likesCount
      },
      reply: {
        origMsgId: reply?.origMsgId,
        origMsgText: reply?.origMsgText,
        origMsgSender: reply?.origMsgSender
      },
      deleted
    };
  });
};

export default {
  getChats,
  addChat,
  updateChat,
  getMessages,
  getMoreMessages,
  addMessage,
  likeMessage,
  markMessageForDeletion,
  deleteMessage,
  markMessageAsDelivered,
  markMessagesAsReadSender,
  markMessagesAsReadRecipient
}
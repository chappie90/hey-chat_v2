import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import api from 'api';

export const getChats = (dispatch: Dispatch<any>) => async (userId: number): Promise<TChat[] | void> => {
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

export const addChat = (dispatch: Dispatch<any>) => (chat: TChat): void => {
  dispatch({ type: 'add_chat', payload: chat });
};

export const updateChat = (dispatch: Dispatch<any>) => (chat: TChat): void => {
  dispatch({ type: 'update_chat', payload: chat });
};

export const getMessages = (dispatch: Dispatch<any>) => async (
  username: string, 
  contactProfile: string, 
  chatId: string
): Promise<any[] | void> => {
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

export const getMoreMessages = (dispatch: Dispatch<any>) => async (
  username: string, 
  contactProfile: string, 
  chatId: string,
  page: number
): Promise<any[] | void> => {
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

export const addMessage = (dispatch: Dispatch<any>) => (chatId: string, message: TMessage): void => {
  dispatch({ type: 'add_message', payload: { chatId, message } });
};

export const likeMessage = (dispatch: Dispatch<any>) => (chatId: string, messageId: string): void => {
  dispatch({ type: 'like_message', payload: { chatId, messageId } });
};

export const markMessageForDeletion = (dispatch: Dispatch<any>) => (chatId: string, messageId: string): void => {
  dispatch({ type: 'mark_message_for_deletion', payload: { chatId, messageId } });
}; 

export const deleteMessage = (dispatch: Dispatch<any>) => (chatId: string, messageId: string): void => {
  dispatch({ type: 'delete_message', payload: { chatId, messageId } });
};

export const markMessageAsDelivered = (dispatch: Dispatch<any>) => (chatId: string, messageId: string): void => {
  dispatch({ type: 'mark_message_as_delivered', payload: { chatId, messageId } });
};

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
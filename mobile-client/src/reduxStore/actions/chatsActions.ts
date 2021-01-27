import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';
import { transformMessagesArray } from 'utils/transformMessagesArray';

type ChatsState = {
  chats: TChat[] | [];
  chatHistory: { 
    [key: string]: { messages: TMessage[], allMessagesLoaded: boolean }
  } | {};
  typingContacts: string[] | [];
  activeChat: TChat;
  activeMessage: TMessage | null;
  msgImgUploadProgress: number;
  msgImgUploadFinished: boolean | null;
};

type ChatsAction =
  | { type: 'get_chats'; payload: TChat[] }
  | { type: 'add_chat'; payload: TChat }
  | { type: 'update_chat'; payload: TChat }
  | { type: 'get_messages'; payload: { chatId: string, messages: TMessage[], allMessagesLoaded: boolean } }
  | { type: 'get_more_messages'; payload: { chatId: string, messages: TMessage[], allMessagesLoaded: boolean } }
  | { type: 'reset_messages'; payload: { chatId: string } }
  | { type: 'add_message'; payload: { chatId: string, message: TMessage } }
  | { type: 'like_message'; payload: { chatId: string, messageId: string } }
  | { type: 'mark_message_for_deletion'; payload: { chatId: string, messageId: string } }
  | { type: 'delete_message'; payload: { chatId: string, messageId: string } }
  | { type: 'mark_message_as_delivered'; payload: { chatId: string, messageId: string } }
  | { type: 'mark_messages_as_read_sender'; payload: { chatId: string } }
  | { type: 'mark_messages_as_read_recipient'; payload: { chatId: string } }
  | { type: 'contact_is_typing'; payload: { contactId: string } }
  | { type: 'contact_stopped_typing'; payload: { contactId: string } }
  | { type: 'reset_typing_contacts' }
  | { type: 'set_active_chat'; payload: { chat: TChat } }
  | { type: 'mute_chat'; payload: { chatId: string, newValue: boolean } }
  | { type: 'delete_chat'; payload: { chatId: string } }
  | { type: 'update_message_image_source'; payload: { chatId: string, messageId: string, imageSource: string } }
  | { type: 'update_contact_avatar'; payload: { contactId: string, avatar: string } }
  | { type: 'set_online_contacts'; payload: TContact[] }
  | { type: 'contact_goes_online_chat'; payload: TContact }
  | { type: 'contact_goes_offline_chat'; payload: string };

const getChats = (userId: number) => async (dispatch: ThunkDispatch<ChatsState, undefined, ChatsAction>) => {
  const params = { userId };

  try {
    const response = await api.get('/chats', { params });
    const chats: TChat[] = response.data.chats.sort((a, b) => new Date(b.lastMessage.message.createDate) - new Date(a.lastMessage.message.createDate));

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
  chatId: string,
  contactProfile?: string, 
) => async (dispatch: any) => {
  const params = { chatId };

  try {
    const response = await api.get('/messages', { params });

    const messages: TMessage[] = transformMessagesArray(response.data.messages, username, chatId, contactProfile);

    dispatch({ type: 'get_messages', payload: { 
      chatId, 
      messages, 
      allMessagesLoaded: response.data.allMessagesLoaded
    } });

    dispatch({ type: 'is_fetching_messages', payload: false });
  } catch (error) {
    console.log('Get messages method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
    dispatch({ type: 'is_fetching_messages', payload: false });
  } 
};

const getMoreMessages = (
  username: string, 
  chatId: string,
  page: number,
  contactProfile?: string 
  ) => async (dispatch: any) => {
  const params = { chatId, page };

  try {
    const response = await api.get('/messages/more', { params });

    const messages: TMessage[] = transformMessagesArray(response.data.messages, username, chatId, contactProfile);

    dispatch({ type: 'get_more_messages', payload: { 
      chatId, 
      messages, 
      allMessagesLoaded: response.data.allMessagesLoaded
    } });

    dispatch({ type: 'is_fetching_messages', payload: false });
  } catch (error) {
    console.log('Get messages method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
    dispatch({ type: 'is_fetching_messages', payload: false });
  } 
};

const setIsFetchingMessages = (isFetching: boolean) => ({ type: 'is_fetching_messages', payload: isFetching });

const resetMessages = (chatId: string) => ({ type: 'reset_messages', payload: { chatId } });

const addMessage = (chatId: string, message: TMessage) => ({ type: 'add_message', payload: { chatId, message } });

const likeMessage = (chatId: string, messageId: string) => ({ type: 'like_message', payload: { chatId, messageId } });

const markMessageForDeletion = (chatId: string, messageId: string) => ({ type: 'mark_message_for_deletion', payload: { chatId, messageId } });

const deleteMessage = (chatId: string, messageId: string) => ({ type: 'delete_message', payload: { chatId, messageId } });

const markMessageAsDelivered = (chatId: string, messageId: string) => ({ type: 'mark_message_as_delivered', payload: { chatId, messageId } });

const markMessagesAsReadSender = (chatId: string) => ({ type: 'mark_messages_as_read_sender', payload: { chatId } });

const markMessagesAsReadRecipient = (chatId: string) => ({ type: 'mark_messages_as_read_recipient', payload: { chatId } });

const contactIsTyping = (contactId: string) => ({ type: 'contact_is_typing', payload: { contactId } });

const contactStoppedTyping = (contactId: string) => ({ type: 'contact_stopped_typing', payload: { contactId } });

const resetTypingContacts = () => ({ type: 'reset_typing_contacts' });

const setActiveChat = (chat: TChat | null) => ({ type: 'set_active_chat', payload: { chat } });

const muteChat = (userId: number, chatId: string, newValue: boolean) => async (dispatch: ThunkDispatch<ChatsState, undefined, ChatsAction>) => { 
  try {
    const response = await api.patch('/chat/mute', { userId, chatId, newValue });

    dispatch({ type: 'mute_chat', payload: { chatId, newValue } });
  } catch (error) {
    console.log('Mute chat method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};

const deleteChat = (userId: number, _id: number, chatId: string) => async (dispatch: ThunkDispatch<ChatsState, undefined, ChatsAction>) => { 
  try {
    const response = await api.patch('/chat/delete', { userId, _id });

    dispatch({ type: 'delete_chat', payload: { chatId } });
  } catch (error) {
    console.log('Delete chat method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};

const messageImageIsUploading = (
  chatId: string, 
  messageId: string, 
  uploadProgress: number, 
  uploadFinished: boolean | null
) => {
  return { 
    type: 'message_image_is_uploading', 
    payload: { chatId, messageId, uploadProgress, uploadFinished }
  };
};

const updateMessageImageSrc = (chatId: string, messageId: string, imageName: string) => ({ type: 'update_message_image_source', payload: { chatId, messageId, imageName } });

const updateContactAvatar = (contactId: string, avatar: string) => ({ type: 'update_contact_avatar', payload: { contactId, avatar } });

const setOnlineContacts = (onlineContacts: TContact[]) => ({ type: 'set_online_contacts', payload: onlineContacts });

const contactGoesOnline = (contact: TContact) => ({ type: 'contact_goes_online_chat', payload: contact });

const contactGoesOffline = (contactId: string) => ({ type: 'contact_goes_offline_chat', payload: contactId });

export default {
  getChats,
  addChat,
  updateChat,
  getMessages,
  getMoreMessages,
  setIsFetchingMessages,
  resetMessages,
  addMessage,
  likeMessage,
  markMessageForDeletion,
  deleteMessage,
  markMessageAsDelivered,
  markMessagesAsReadSender,
  markMessagesAsReadRecipient,
  contactIsTyping,
  contactStoppedTyping,
  resetTypingContacts,
  setActiveChat,
  muteChat,
  deleteChat,
  messageImageIsUploading,
  updateMessageImageSrc,
  updateContactAvatar,
  setOnlineContacts,
  contactGoesOnline,
  contactGoesOffline
};
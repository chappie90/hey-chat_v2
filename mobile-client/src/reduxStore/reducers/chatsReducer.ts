import { act } from 'react-test-renderer';
import { Reducer } from 'redux';

type ChatsState = {
  chats: TChat[] | [];
  chatHistory: { 
    [key: string]: { messages: TMessage[], allMessagesLoaded: boolean }
  } | {};
  isFetchingMessages: boolean;
  typingContacts: string[] | [];
  activeChat: TChat | null;
  activeMessage: TMessage | null;
  msgImgUploadProgress: number;
  msgImgUploadFinished: boolean | null;
};

const INITIAL_STATE: ChatsState = {
  chats: [],
  chatHistory: {},
  isFetchingMessages: false,
  typingContacts: [],
  activeChat: null,
  activeMessage: null,
  msgImgUploadProgress: 0,
  msgImgUploadFinished: null
};

export const chatsReducer: Reducer = (state = INITIAL_STATE, action) => {
  let updatedChats: TChat[];
  let updatedMessages: TMessage[];

  switch (action.type) {
    case 'get_chats':
      return { ...state, chats: action.payload };
    case 'add_chat':
      return { ...state, chats: [ action.payload, ...state.chats ] };
    case 'update_chat':
      updatedChats = (state.chats as TChat[]).map((chat: TChat) => {
        return chat.chatId === action.payload.chatId ?
          { ...action.payload } :
          chat
      });

      updatedChats = updatedChats.sort((a, b) => new Date(b.lastMessage.message.createDate) - new Date(a.lastMessage.message.createDate));

      return { 
        ...state, 
        chats: updatedChats
      };
    case 'get_messages':
      return { 
        ...state, 
        chatHistory: { 
          ...state.chatHistory, 
          [action.payload.chatId]: {
            messages: action.payload.messages,
            allMessagesLoaded: action.payload.allMessagesLoaded
          }
        } 
      };
    case 'get_more_messages':
      return { 
        ...state, 
        chatHistory: { 
          ...state.chatHistory, 
          [action.payload.chatId]: {
            messages: [ ...state.chatHistory[action.payload.chatId].messages, ...action.payload.messages ],
            allMessagesLoaded: action.payload.allMessagesLoaded
          }
        } 
      };
    case 'is_fetching_messages':
      return { ...state, isFetchingMessages: action.payload };
    case 'reset_messages':
      return { 
        ...state, 
        chatHistory: { 
          ...state.chatHistory, 
          [action.payload.chatId]: {
            messages: state.chatHistory[action.payload.chatId].messages.slice(0, 20),
            allMessagesLoaded: false
          }
        } 
      };
    case 'add_message': 
      // If there are previous messages in the chat
      if (state.chatHistory[action.payload.chatId]) {
        return { 
          ...state, 
          chatHistory: {
            ...state.chatHistory,
            [action.payload.chatId]: {
              ...state.chatHistory[action.payload.chatId],
              messages: [ action.payload.message, ...state.chatHistory[action.payload.chatId].messages ]
            } 
          }
        };
      } else {
        // If this is the first message in the chat
        return { 
          ...state, 
          chatHistory: {
            ...state.chatHistory, 
            [action.payload.chatId]: {
              messages: [ action.payload.message ],
              allMessagesLoaded: true
            }
          } 
        };
      }
    case 'like_message':
      if (!state.chatHistory[action.payload.chatId]) return state;;

      updatedMessages = state.chatHistory[action.payload.chatId].messages.map((msg: TMessage) => {
        return msg._id === action.payload.messageId ?
          { 
            ...msg,
            liked: {
              likedByUser: !msg.liked.likedByUser,
              likesCount: msg.liked.likedByUser ? msg.liked.likesCount - 1  : msg.liked.likesCount + 1
            }
          } :
          msg
      });
      
      return {
        ...state,
        chatHistory: {
          ...state.chatHistory,
          [action.payload.chatId]: {
            ...state.chatHistory[action.payload.chatId],
            messages: updatedMessages
          }
        }
      };
    case 'mark_message_for_deletion':
      updatedMessages = state.chatHistory[action.payload.chatId].messages.map((msg: TMessage) => {
        return msg._id === action.payload.messageId ?
          {  ...msg, deleted: true } :
          msg
      });

      return {
        ...state,
        chatHistory: {
          ...state.chatHistory,
          [action.payload.chatId]: {
            ...state.chatHistory[action.payload.chatId],
            messages: updatedMessages
          }
        }
      };
    case 'delete_message':
      if (!state.chatHistory[action.payload.chatId]) return state;;

      updatedMessages = state.chatHistory[action.payload.chatId].messages.filter(
        (msg: TMessage) => msg._id !== action.payload.messageId
      );

      return {
        ...state,
        chatHistory: {
          ...state.chatHistory,
          [action.payload.chatId]: {
            ...state.chatHistory[action.payload.chatId],
            messages: updatedMessages
          }
        }
      };
    case 'mark_message_as_delivered':
      updatedMessages = state.chatHistory[action.payload.chatId].messages.map((msg: TMessage) => {
        return msg._id === action.payload.messageId ?
          {  ...msg, delivered: true } :
          msg
      });

      return {
        ...state,
        chatHistory: {
          ...state.chatHistory,
          [action.payload.chatId]: {
            ...state.chatHistory[action.payload.chatId],
            messages: updatedMessages
          }
        }
      };
    case 'mark_messages_as_read_sender':
      if (!state.chatHistory[action.payload.chatId]) return state;

      updatedMessages = state.chatHistory[action.payload.chatId].messages.map((msg: TMessage) => {
        return msg.read === false ?
          {  ...msg, read: true } :
          msg
      });

      return {
        ...state,
        chatHistory: {
          ...state.chatHistory,
          [action.payload.chatId]: {
            ...state.chatHistory[action.payload.chatId],
            messages: updatedMessages
          }
        }
      };
    case 'mark_messages_as_read_recipient': 
      updatedChats = (state.chats as TChat[]).map((chat: TChat) => {
        return chat.chatId === action.payload.chatId ?
          { 
            ...chat,
            lastMessage: { 
              ...chat.lastMessage,
              read: true 
            },
            unreadMessagesCount: 0
          } :
          chat
      });
  
      return { 
        ...state, 
        chats: updatedChats
      };  
    case 'contact_is_typing':
      return {
        ...state,
        typingContacts: [ ...state.typingContacts, action.payload.contactId ]
      };
    case 'contact_stopped_typing':
      return {
        ...state,
        typingContacts: state.typingContacts.filter((contactId: string) => contactId !== action.payload.contactId)
      };
    case 'reset_typing_contacts':
      return {
        ...state,
        typingContacts: []
      };
    case 'set_active_chat':
      return {
        ...state,
        activeChat: action.payload.chat
      };
    case 'mute_chat':
      updatedChats = (state.chats as TChat[]).map((chat: TChat) => {
        return chat.chatId === action.payload.chatId ? 
          { 
            ...chat, 
            muted: action.payload.newValue
          } : 
          chat;
      });
      return { ...state, chats: updatedChats };
    case 'delete_chat':
      updatedChats = state.chats.filter((chat: TChat) => chat.chatId !== action.payload.chatId );

      return { ...state, chats: updatedChats };
    case 'message_image_is_uploading':
      const activeMessage = action.payload.uploadFinished === null ?
        null :
        state.chatHistory[action.payload.chatId].messages.filter(
          (msg: TMessage) => msg._id === action.payload.messageId
      )[0];

      return {
        ...state,
        activeMessage,
        msgImgUploadProgress: action.payload.uploadProgress,
        msgImgUploadFinished: action.payload.uploadFinished
      };
    case 'update_message_image_source':
      updatedMessages = state.chatHistory[action.payload.chatId].messages.map((msg: TMessage) => {
        return msg._id === action.payload.messageId ?
          {  ...msg, image: action.payload.imageName } :
          msg
      });

      return {
        ...state,
        chatHistory: {
          ...state.chatHistory,
          [action.payload.chatId]: {
            ...state.chatHistory[action.payload.chatId],
            messages: updatedMessages
          }
        }
      };
    case 'update_contact_avatar':
      updatedChats = (state.chats as TChat[]).map((chat: TChat) => {
        return chat.participants.filter((p: any) => p._id === action.payload.contactId).length > 0 ?
          { 
            ...chat, 
            participants: chat.participants.map((p: any) => {
              return p._id === action.payload.contactId ?
                {
                  ...p,
                  avatar: {
                    ...state.avatar,
                    small: action.payload.avatar
                  }
                } :
                p
            })
          } : 
          chat;
      });
      
      return { ...state, chats: updatedChats };
    case 'set_online_contacts':
      updatedChats = (state.chats as TChat[]).map((chat: TChat) => {
        return action.payload.filter((contact: TContact) => contact.chatId === chat.chatId).length > 0 ?
          { 
            ...chat, 
            online: true
          } : 
          chat;
      });
      
      return { ...state, chats: updatedChats };
    case 'contact_goes_online_chat':
      updatedChats = (state.chats as TChat[]).map((chat: TChat) => {
        return chat.participants.filter((p: any) => p._id === action.payload._id).length > 0 ?
          { 
            ...chat, 
            online: true
          } : 
          chat;
      });
      
      return { ...state, chats: updatedChats };
    case 'contact_goes_offline_chat':
      updatedChats = (state.chats as TChat[]).map((chat: TChat) => {
        return chat.participants.filter((p: any) => p._id === action.payload).length > 0 ?
          { 
            ...chat, 
            online: false
          } : 
          chat;
      });

      return { ...state, chats: updatedChats };
    default:
      return state;
  }
};
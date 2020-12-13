import { Reducer } from 'redux';

type ChatsState = {
  chats: TChat[] | [];
  chatHistory: { 
    [key: string]: { messages: TMessage[], allMessagesLoaded: boolean }
  } | {};
  typingContacts: string[] | [];
  activeContactId: string;
};

const INITIAL_STATE: ChatsState = {
  chats: [],
  chatHistory: {},
  typingContacts: [],
  activeContactId: ''
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
    case 'set_active_contact':
      return {
        ...state,
        activeContactId: action.payload.contactId
      };
    default:
      return state;
  }
};
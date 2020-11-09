import createDataContext from './createDataContext';
import api from '../api/api';

type ChatsState = {
  chats: TChat[] | [];
  chatHistory: { 
    [key: string]: { messages: TMessage[], allMessagesLoaded: boolean }
  } | {};
};

type ChatsAction =
  | { type: 'get_chats'; payload: TChat[] }
  | { type: 'add_chat'; payload: TChat }
  | { type: 'get_messages'; payload: { chatId: string, messages: TMessage[], allMessagesLoaded: boolean } }
  | { type: 'get_more_messages'; payload: { chatId: string, messages: TMessage[], allMessagesLoaded: boolean } }
  | { type: 'add_message'; payload: { chatId: string, message: TMessage } }
  | { type: 'like_message'; payload: { chatId: string, messageId: string } }
  | { type: 'mark_message_for_deletion'; payload: { chatId: string, messageId: string } }
  | { type: 'delete_message'; payload: { chatId: string, messageId: string } }
  | { type: 'mark_message_as_delivered'; payload: { chatId: string, messageId: string } };

const chatReducer = (state: ChatsState, action: ChatsAction) => {
  let updatedMessages: TMessage[];

  switch (action.type) {
    case 'get_chats':
      return { ...state, chats: action.payload };
    case 'add_chat':
      return { ...state, chats: [ action.payload, ...state.chats ] };
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
      if (!state.chatHistory[action.payload.chatId]) return;

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
      if (!state.chatHistory[action.payload.chatId]) return;

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

      // case 'mark_message_read': 
      // // if you have more than initial 50 messages loaded it will jump back to first 50...
      // // if (state.chat[action.payload]) {
      // //   const markedMessage = state.chat[action.payload].map(item => {
      // //     return item.read === false ? { ...item, read: true } : item;
      // //   });
      // //   return { ...state, chat: { 
      // //     ...state.chat, 
      // //     [action.payload]: markedMessage } };
      // // } else {
      // //   return state;
      // // }
      //  const markedMessage = state.chat[action.payload].map(item => {
      //     return item.read === false ? { ...item, read: true } : item;
      //   });
      //   return { ...state, chat: { 
      //     ...state.chat, 
      //     [action.payload]: markedMessage } };

    default:
      return state;
  }
};

const getChats = dispatch => async (userId: number): Promise<TChat[] | void> => {
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

const addChat = dispatch => (chat: TChat): void => {
  dispatch({ type: 'add_chat', payload: chat });
};

const getMessages = dispatch => async (
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

const getMoreMessages = dispatch => async (
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

const addMessage = dispatch => (chatId: string, message: TMessage): void => {
  dispatch({ type: 'add_message', payload: { chatId, message } });
};

const likeMessage = dispatch => (chatId: string, messageId: string): void => {
  dispatch({ type: 'like_message', payload: { chatId, messageId } });
};

const markMessageForDeletion = dispatch => (chatId: string, messageId: string): void => {
  dispatch({ type: 'mark_message_for_deletion', payload: { chatId, messageId } });
}; 

const deleteMessage = dispatch => (chatId: string, messageId: string): void => {
  dispatch({ type: 'delete_message', payload: { chatId, messageId } });
};

const markMessageAsDelivered = dispatch => (chatId: string, messageId: string): void => {
  dispatch({ type: 'mark_message_as_delivered', payload: { chatId, messageId } });
};

// const markMessageAsRead = dispatch => async (chatId) => {
//   // try {
//   //   const response = await chatApi.patch('/message/read', { username, recipient });

//   //   if (!response.data.response) {
//   //     return;
//   //   }

//   dispatch({ type: 'mark_message_read', payload: chatId });
//   // } catch (err) {
//   //   console.log(err);
//   //   throw err;
//   // }
// };

export const { Context, Provider } = createDataContext(
  chatReducer,
  { 
    getChats,
    addChat,
    getMessages,
    getMoreMessages,
    addMessage,
    likeMessage,
    markMessageForDeletion,
    deleteMessage,
    markMessageAsDelivered
  },
  {  
    chats: [],
    chatHistory: {}
  }
);

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
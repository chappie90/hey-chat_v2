import createDataContext from './createDataContext';
import api from '../api/api';

type ChatsState = {
  chats: TChat[] | [];
  messages: { [key: number]: TMessage[] } | {};
};

type ChatsAction =
  | { type: 'get_chats'; payload: TChat[] }
  | { type: 'get_messages'; payload: { chatId: number, messages: TMessage[] } };

const chatReducer = (state: ChatsState, action: ChatsAction) => {
  switch (action.type) {
    case 'get_chats':
      return { ...state, chats: action.payload };
    case 'get_messages':
      const { chatId, messages } = action.payload; 
      return { ...state, messages: { ...state.messages, [chatId]: messages } };
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

const getMessages = dispatch => async (
  username: string, 
  contactProfile: string, 
  chatId: number
): Promise<any[] | void> => {
  const params = { chatId };

  try {
    const response = await api.get('/messages', { params });

    const messages: TMessage[] = response.data.messages.map((message: any) => {
      const { 
        message: { id, text, createDate }, 
        sender, 
        image, 
        admin, 
        delivered, 
        read,  
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
        reply: {
          origMsgId: reply?.origMsgId,
          origMsgText: reply?.origMsgText,
          origMsgSender: reply?.origMsgSender
        },
        deleted
      };
    });

    dispatch({ type: 'get_messages', payload: { chatId, messages } });

    return messages;
  } catch (error) {
    console.log('Get messages method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  } 
};

  export const { Context, Provider } = createDataContext(
    chatReducer,
    { 
      getChats,
      getMessages
    },
    {  
      chats: [],
      messages: {}
    }
  );
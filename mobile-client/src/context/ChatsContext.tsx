import createDataContext from './createDataContext';
import api from '../api/api';
import { Contact, Chat } from './types';

type ChatsState = {
  chats: Chat[] | [];
};

type ChatsAction =
  | { type: 'get_chats'; payload: Chat[] };

  const chatReducer = (state: ChatsState, action: ChatsAction) => {
    switch (action.type) {
      case 'get_chats':
        return { ...state, previousChats: action.payload };
      default:
        return state;
    }
  };

  const getChats = dispatch => async (userId: number): Promise<void> => {
    const params = { userId };

    try {
      const response = await api.get('/chats', { params });
  
      const chats = response.data.chats.sort((a, b) => new Date(b.date) - new Date(a.date));
  
      dispatch({ type: 'get_chats', payload: chats });
  
      return chats;
    } catch (error) {
      console.log('Get chats method error');
      if (error.response) console.log(error.response.data.message);
      if (error.message) console.log(error.message);
    }
  };

  export const { Context, Provider } = createDataContext(
    chatReducer,
    { 
      getChats,
    },
    {  
      chats: []
    }
  );
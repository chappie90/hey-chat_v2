import { Reducer } from 'redux';

type AuthState = {
  userId: number | null;
  username: string | null;
  token: string | null;
  socketState: any | null;
  currentScreen: string;
};

const INITIAL_STATE: AuthState = {
  userId: null,
  username: null,
  token: null,
  socketState: null,
  currentScreen: ''
};

export const authReducer: Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'signin':
      return { 
        userId: action.payload.userId,
        username: action.payload.username, 
        token: action.payload.token
      };
    case 'sign_out':
      return {
        userId: null,  
        username: null, 
        token: null,
        socketState: null
      };
    case 'set_socket':
      return { ...state, socketState: action.payload };
    case 'get_current_screen':
      return { ...state, currentScreen: action.payload };
    default: 
      return state;
  }
};

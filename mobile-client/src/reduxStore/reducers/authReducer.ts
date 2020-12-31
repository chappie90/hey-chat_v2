import { act } from 'react-test-renderer';
import { Reducer } from 'redux';

type AuthState = {
  isAuthenticating: boolean;
  authError: string;
  userId: number | null;
  username: string | null;
  token: string | null;
};

const INITIAL_STATE: AuthState = {
  isAuthenticating: false,
  authError: '',
  userId: null,
  username: null,
  token: null,
};

export const authReducer: Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'signin':
      return { 
        ...state,
        userId: action.payload.userId,
        username: action.payload.username, 
        token: action.payload.token
      };
    case 'is_authenticating':
      return { ...state, isAuthenticating: action.payload };
    case 'set_auth_error':
      return { ...state, authError: action.payload };
    case 'sign_out':
      return {
        userId: null,  
        username: null, 
        token: null,
        // socketState: null
      };
    default: 
      return state;
  }
};

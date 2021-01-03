import { Reducer } from 'redux';

type AuthState = {
  isAuthenticating: boolean;
  authError: string;
  userId: number | null;
  username: string | null;
  token: string | null;
  user: {
    avatar?: string;
  }
};

const INITIAL_STATE: AuthState = {
  isAuthenticating: false,
  authError: '',
  userId: null,
  username: null,
  token: null,
  user: {
    avatar: ''
  }
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
    case 'get_avatar_image':
      return { 
        ...state, 
        user: {
          ...state.user,
          avatar: action.payload 
        }
      };
    case 'update_avatar_image':
      return { 
        ...state, 
        user: {
          ...state.user,
          avatar: action.payload 
        }
      };
    case 'delete_avatar_image':
      return { 
        ...state, 
        user: {
          ...state.user,
          avatar: '' 
        }
      };
    default: 
      return state;
  }
};

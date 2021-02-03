import { Reducer } from 'redux';

type AuthState = {
  isAuthenticating: boolean;
  authError: string;
  user: TUser;
};

const INITIAL_STATE: AuthState = {
  isAuthenticating: false,
  authError: '',
  user: {
    _id: null,
    username: '',
    authToken: '',
    avatar: {
      small: '',
      medium: ''
    }
  }
};

export const authReducer: Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'signin':
      return { 
        ...state,
        user: {
          ...state.user,
          _id: action.payload._id,
          username: action.payload.username,
          authToken: action.payload.authToken
        }
      };
    case 'is_authenticating':
      return { ...state, isAuthenticating: action.payload };
    case 'set_auth_error':
      return { ...state, authError: action.payload };
    case 'sign_out':return { ...state, ...INITIAL_STATE };
    case 'get_avatar_image':
      return { 
        ...state, 
        user: {
          ...state.user,
          avatar: {
            small: action.payload.small,
            medium: action.payload.medium
          }
        }
      };
    case 'update_avatar_image':
      return { 
        ...state, 
        user: {
          ...state.user,
          avatar: {
            small: action.payload.small,
            medium: action.payload.medium
          }
        }
      };
    case 'delete_avatar_image':
      return { 
        ...state, 
        user: {
          ...state.user,
          avatar: {
            small: '',
            medium: ''
          } 
        }
      };
    default: 
      return state;
  }
};

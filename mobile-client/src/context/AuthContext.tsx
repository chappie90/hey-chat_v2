import AsyncStorage from '@react-native-community/async-storage';
import { Dispatch } from 'react';

import createDataContext from './createDataContext';
import api from 'api';

type AuthState = {
  userId: number | null;
  username: string | null;
  token: string | null;
  socketState: any | null;
};

type AuthAction = 
  | { type: 'signin'; payload: TUser }
  | { type: 'sign_out'; }
  | { type: 'set_socket'; payload: any };

const authReducer = (state: AuthState, action: AuthAction) => {
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
    default: 
      return state;
  }
};

const signup = (dispatch: Dispatch<any>) => async (username: string, password: string): Promise<void> => {
  try {
    const response = await api.post('/signup', { username, password });

    const user = { 
      userId: response.data.userId,
      username: response.data.username, 
      token: response.data.token 
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));

    dispatch({ type: 'signin', payload: user });
} catch (error) {
    console.log('Signup method error');
    if (error.response) {
      console.log(error.response.data.message);
      console.log(error.response.status);
    }
    if (error.message) console.log(error.message);
    return error.response ? error.response : error.message;
  }
};

const signin = (dispatch: Dispatch<any>)  => async (username: string, password: string): Promise<void> => {
  try {
    const response = await api.post('/signin', { username, password });

    const user = { 
      userId: response.data.userId,
      username: response.data.username, 
      token: response.data.token 
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));

    dispatch({ type: 'signin', payload: user });
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
      console.log(error.response.status);
    }
    if (error.message) console.log(error.message);
    return error.response ? error.response : error.message;
  }
};

const autoSignin = (dispatch: Dispatch<any>) => async (): Promise<void> => {
  try {
    const jsonValue = await AsyncStorage.getItem('user')
    const user = jsonValue !== null ? JSON.parse(jsonValue) : null;

    if (user && user.token) {
      dispatch({ type: 'signin', payload: user });
    } 
  } catch(err) {
    console.log('Could not fetch user data inside autoSignin method' +  err);
  }
};

const signOut = (dispatch: Dispatch<any>) => async (userId: string, socketInstance: any): Promise<void> => {
  try {
    await AsyncStorage.removeItem('user');
    
    socketInstance.disconnect();
    // const response = await api.patch('/signout', { userId });

    dispatch({ type: 'sign_out' });
  } catch (err) {
    console.log('Could not remove user data inside signout method ' +  err);
  } 
};

const setSocketState = (dispatch: Dispatch<any>) => (socketState: any): void => {
  dispatch({ type: 'set_socket', payload: socketState });
};

export const { Context, Provider } = createDataContext(
  authReducer,
  { 
    signup,
    signin, 
    autoSignin, 
    signOut,
    setSocketState
  },
  { 
    userId: null, 
    username: null,
    token: null,
    socketState: null
  }
);
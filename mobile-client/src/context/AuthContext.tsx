import AsyncStorage from '@react-native-community/async-storage';

import createDataContext from './createDataContext';
import api from '../api/api';

type User = {
  userId: string;
  username: string;
  token: string;
};

type AuthState = {
  userId: string | null;
  username: string | null;
  token: string | null;
};

type AuthAction = 
  | { type: 'signin'; payload: User }
  | { type: 'signout'; };

const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'signin':
    return { 
      userId: action.payload.userId,
      username: action.payload.username, 
      token: action.payload.token
    };
    case 'signout':
    return {
      userId: null,  
      username: null, 
      token: null
    };
    default: 
    return state;
  }
};

const signup = dispatch => async (username: string, password: string): Promise<void> => {
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
    console.log(error.response.data.message);
    console.log(error.response.status);
    return error.response;
  }
};

const signin = dispatch => async (username: string, password: string): Promise<void | any> => {
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
    console.log('Signin method error');
    console.log(error.response.data.message);
    console.log(error.response.status);
    return error.response;
  }
};

const autoSignin = dispatch => async (): Promise<void> => {
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

const signout = dispatch => async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem('user');

    // const response = await api.patch('/signout', { userId });

    dispatch({ type: 'signout' });
  } catch (err) {
    console.log('Could not remove user data inside signout method ' +  err);
  } 
};

export const { Context, Provider } = createDataContext(
  authReducer,
  { 
    signup,
    signin, 
    autoSignin, 
    signout
  },
  { 
    userId: null, 
    username: null,
    token: null
  }
);
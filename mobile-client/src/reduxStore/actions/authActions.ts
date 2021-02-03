import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from 'api';

type AuthState = {
  isAuthenticating: boolean;
  authError: string;
  user: TUser;
};

type AuthAction = 
  | { type: 'signin'; payload: TUser }
  | { type: 'is_authenticating'; payload: boolean }
  | { type: 'set_auth_error'; payload: string }
  | { type: 'sign_out' }
  | { type: 'get_avatar_image'; payload: string }
  | { type: 'update_avatar_image'; payload: string }
  | { type: 'delete_avatar_image' };

const signup = (username: string, password: string) => async (dispatch: ThunkDispatch<AuthState, undefined, AuthAction>) => {
  try {
    const response = await api.post('/signup', { username, password });
    
    const user = { 
      _id: response.data._id,
      username: response.data.username, 
      authToken: response.data.authToken 
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));

    dispatch({ type: 'is_authenticating', payload: false });

    dispatch({ type: 'signin', payload: user });
  } catch (error) {
    console.log('Signup method error');
    if (error.response) {
      console.log(error.response.data.message);
      console.log(error.response.status);
    }
    if (error.message) console.log(error.message);

    dispatch({ type: 'is_authenticating', payload: false });
    dispatch({ 
      type: 'set_auth_error', 
      payload: error.response ? 
        error.response.data.message : 
        error.message 
    });
  }
};

const signin = (username: string, password: string) => async (dispatch: ThunkDispatch<AuthState, undefined, AuthAction>) => {
  try {
    const response = await api.post('/signin', { username, password });

    const user = { 
      _id: response.data._id,
      username: response.data.username, 
      authToken: response.data.authToken 
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));

    dispatch({ type: 'is_authenticating', payload: false });

    dispatch({ type: 'signin', payload: user });
  } catch (error) {
    if (error.response) {
      console.log(error.response.data.message);
      console.log(error.response.status);
    }
    if (error.message) console.log(error.message);

    dispatch({ type: 'is_authenticating', payload: false });
    dispatch({ 
      type: 'set_auth_error', 
      payload: error.response ? 
        error.response.data.message : 
        error.message 
    });
  }
};

const isAuthenticating = (state: boolean) => ({ type: 'is_authenticating', payload: state });

const setAuthError = (errorMsg: string) => ({ type: 'set_auth_error', payload: errorMsg });

const autoSignin = () => async (dispatch: ThunkDispatch<AuthState, undefined, AuthAction>) => {
  try {
    const jsonValue = await AsyncStorage.getItem('user')
    const user = jsonValue !== null ? JSON.parse(jsonValue) : null;

    if (user && user.authToken) {
      dispatch({ type: 'signin', payload: user });
    } 
  } catch(err) {
    console.log('Could not fetch user data inside autoSignin method' +  err);
  }
};

const signOut = (userId: string, socketInstance: any) => async (dispatch: ThunkDispatch<AuthState, undefined, AuthAction>) => {
  try {
    await AsyncStorage.removeItem('user');
    
    socketInstance.disconnect();
    // const response = await api.patch('/signout', { userId });

    dispatch({ type: 'sign_out' });
  } catch (err) {
    console.log('Could not remove user data inside signout method ' +  err);
  } 
};

const getAvatarImage = (userId: number) => async (dispatch: ThunkDispatch<AuthState, undefined, AuthAction>) => {
  const params = { userId };

  try {
    const response = await api.get('/image', { params });

    dispatch({ type: 'get_avatar_image', payload: response.data.avatar });
  } catch (error) {
    console.log('Get profile image method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};

const updateAvatarImage = (avatar: string) => ({ type: 'update_avatar_image', payload: avatar });

const deleteAvatarImage = (userId: number) => async (dispatch: ThunkDispatch<AuthState, undefined, AuthAction>) => {
  try {
    const response = await api.patch('/image/delete', { userId });

    dispatch({ type: 'delete_avatar_image' });
  } catch (error) {
    console.log('Delete profile image method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};

export default {
  signup,
  signin,
  isAuthenticating,
  setAuthError,
  autoSignin,
  signOut,
  getAvatarImage,
  updateAvatarImage,
  deleteAvatarImage
};  
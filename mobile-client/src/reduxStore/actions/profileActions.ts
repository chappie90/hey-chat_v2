import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import api from 'api';

export const getProfileImage = (dispatch: Dispatch<any>) => async (userId: number): Promise<void> => {
  const params = { userId };

  try {
    const response = await api.get('/image', { params });

    dispatch({ type: 'get_image', payload: response.data.profileImage });
  } catch (error) {
    console.log('Get profile image method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};

export const updateProfileImage = (dispatch: Dispatch<any>) => (image: string): void => {
  dispatch({ type: 'update_image', payload: image });
};

export const deleteProfileImage = (dispatch: Dispatch<any>) => async (userId: number): Promise<void> => {
  try {
    const response = await api.patch('/image/delete', { userId });

    dispatch({ type: 'delete_image' });
  } catch (error) {
    console.log('Delete profile image method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};
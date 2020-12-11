import { ActionCreator, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import api from 'api';

type ProfileState = {
  profileImage: string | null;
};

type ProfileAction =
  | { type: 'get_image'; payload: string }
  | { type: 'update_image'; payload: string }
  | { type: 'delete_image' };

const getProfileImage = (userId: number) => async (dispatch: ThunkDispatch<ProfileState, undefined, ProfileAction>) => {
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

const updateProfileImage = (image: string) => ({ type: 'update_image', payload: image });

const deleteProfileImage = (userId: number) => async (dispatch: ThunkDispatch<ProfileState, undefined, ProfileAction>) => {
  try {
    const response = await api.patch('/image/delete', { userId });

    dispatch({ type: 'delete_image' });
  } catch (error) {
    console.log('Delete profile image method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};

export default {
  getProfileImage,
  updateProfileImage,
  deleteProfileImage
}
import createDataContext from './createDataContext';
import api from '../api/api';

type ProfileState = {
  profileImage: string | null;
};

type ProfileAction =
  | { type: 'get_image'; payload: string }
  | { type: 'update_image'; payload: string }
  | { type: 'delete_image' };

const profileReducer = (state: ProfileState, action: ProfileAction) => {
  switch (action.type) {
    case 'get_image':
      return { ...state, profileImage: action.payload };
    case 'update_image':
      return { ...state, profileImage: action.payload };
    case 'delete_image':
      return {
        profileImage: null
      };
    default:
      return state;
  }
};

const getProfileImage = dispatch => async (userId: number): Promise<void> => {
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

const updateProfileImage = dispatch => (image: string): void => {
  dispatch({ type: 'update_image', payload: image });
};

const deleteProfileImage = dispatch => async (userId: number): Promise<void> => {
  try {
    const response = await api.patch('/image/delete', { userId });

    dispatch({ type: 'delete_image' });
  } catch (error) {
    console.log('Delete profile image method error');
    if (error.response) console.log(error.response.data.message);
    if (error.message) console.log(error.message);
  }
};

export const { Context, Provider } = createDataContext(
  profileReducer,
  { 
    getProfileImage, 
    updateProfileImage,
    deleteProfileImage 
  },
  { profileImage: null }
);
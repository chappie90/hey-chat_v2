import { Reducer } from 'redux';

type ProfileState = {
  profileImage: string;
};

const INITIAL_STATE: ProfileState = {
  profileImage: ''
};

export const profileReducer: Reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'get_image':
      return { ...state, profileImage: action.payload };
    case 'update_image':
      return { ...state, profileImage: action.payload };
    case 'delete_image':
      return {
        profileImage: ''
      };
    default:
      return state;
  }
};
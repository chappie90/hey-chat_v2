import { Dispatch } from 'redux';

import { profileActions } from 'reduxStore/actions';

const onProfileImageUpdated = (data: string, dispatch: Dispatch) => {
  const { userId, profileImage } = JSON.parse(data);
  console.log('inside profile event listener');
  console.log(userId);
  console.log(profileImage);
};

export default {
  onProfileImageUpdated
};
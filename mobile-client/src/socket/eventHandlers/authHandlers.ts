import { Dispatch } from 'redux';

import { authActions } from 'reduxStore/actions';


const onUserConnected = (dispatch: Dispatch) => {
  dispatch(authActions.setUserConnectionState(true));
};

export default {
  onUserConnected
};
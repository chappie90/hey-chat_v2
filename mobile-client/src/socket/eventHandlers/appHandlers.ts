import { Dispatch } from 'redux';

import { appActions } from 'reduxStore/actions';

const onUserConnected = (dispatch: Dispatch) => {
  dispatch(appActions.setUserConnectionState(true));
};

export default {
  onUserConnected
};
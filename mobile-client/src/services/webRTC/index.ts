import { Dispatch } from 'redux';
import { callActions } from 'reduxStore/actions';

const stopLocalStream = (callState: TCall, dispatch: Dispatch) => {
  callState.localStream.getTracks().forEach((t: any) => t.stop());
  callState.localStream.release();
  dispatch(callActions.setLocalStream(null));
};

export default {
  stopLocalStream
};
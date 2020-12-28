import { Dispatch } from 'redux';
import { RTCSessionDescription } from 'react-native-webrtc';

import { videoCallActions } from 'reduxStore/actions';

const onIncomingVideoCallReceived = (data: string, dispatch: Dispatch) => {
  const { callerId, callerName, offer } = JSON.parse(data);
  dispatch(videoCallActions.receiveIncomingCall(callerId, callerName, offer));
};

const onVideoCallAccepted = (data: string, RTCPeerConnection: any) => {
  const { answer } = JSON.parse(data);
  RTCPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

const onVideoCallRejected = (navigate: any, dispatch: Dispatch) => {
  dispatch(videoCallActions.setRTCPeerConnection(null));
  navigate('CurrentChat', {});
};

export default {
  onIncomingVideoCallReceived,
  onVideoCallAccepted,
  onVideoCallRejected
};

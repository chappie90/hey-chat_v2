import { Dispatch } from 'redux';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';

import { videoCallActions } from 'reduxStore/actions';
import { emitSendICECandidate } from 'socket/eventEmitters';

const onVideoCallOfferReceived = (data: string, userId: string, socketState: any, dispatch: Dispatch) => {
  const { chatType, chatId, callerId, callerName, callerProfile, offer } = JSON.parse(data);
  // Create RTC peer connection
  const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
  const peerConn = new RTCPeerConnection(configuration);
  dispatch(videoCallActions.setRTCPeerConnection(peerConn));

  // Send candidates to caller
  peerConn.onicecandidate = event => {
    if (event.candidate) {
      const data = { userId, contactId: callerId, candidate: event.candidate };
      emitSendICECandidate(JSON.stringify(data), socketState);
    }
  };
  
  dispatch(videoCallActions.receiveIncomingCall(chatType, chatId, callerId, callerName, callerProfile, offer));

  // Start playing ringtone
  // InCallManager.start({media: 'video'});
  // InCallManager.startRingtone('_BUNDLE_');
};

const onICECandidateReceived = (data: string, RTCPeerConnection: any, dispatch: Dispatch) => {
  const { userId, contactId, candidate } = JSON.parse(data);
  if (RTCPeerConnection) {
    RTCPeerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    .catch((err: Error) => {
      console.log(`Add ice candidate video call method error ${err}`);
    });
  }
};

const onVideoCallAccepted = (data: string, RTCPeerConnection: any, dispatch: Dispatch) => {
  const { recipientId, recipientName, recipientProfile, answer } = JSON.parse(data);
  RTCPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  dispatch(videoCallActions.setActiveCallStatus(true));
};

const onVideoCallRejected = (navigate: any, dispatch: Dispatch) => {
  dispatch(videoCallActions.setRTCPeerConnection(null));

  // Stop ringing when user rejects call
  // InCallManager.stopRingtone();
  // InCallManager.stop();

  navigate('CurrentChat', {});
};

const onVideoCallCancelled = (dispatch: Dispatch) => {
  dispatch(videoCallActions.receiveIncomingCall('', '', '', '', '', null));
};

const onVideoCallEnded = (
  data: string, 
  localStream: any,
  RTCPeerConnection: any, 
  navigate: any, 
  dispatch: Dispatch
) => {
  const { chatType, chatId, senderId, senderName, senderProfile } = JSON.parse(data);
  // Stop local stream
  localStream.getTracks().forEach((t: any) => t.stop());
  localStream.release();
  dispatch(videoCallActions.setLocalStream(null));

  // Close Peer connection and clean up event listeners
  RTCPeerConnection.close();
  RTCPeerConnection.onicecandidate = null; 
  RTCPeerConnection.onaddstream = null; 
  dispatch(videoCallActions.setRTCPeerConnection(null));

  dispatch(videoCallActions.setRemoteStream(null));
  dispatch(videoCallActions.setActiveCallStatus(false));

  const routeParams = { 
    chatType, 
    chatId, 
    contactId: senderId,
    contactName: senderName, 
    contactProfile: senderProfile 
  }; 
  navigate('CurrentChat', routeParams);
};

export default {
  onVideoCallOfferReceived,
  onICECandidateReceived,
  onVideoCallAccepted,
  onVideoCallRejected,
  onVideoCallCancelled,
  onVideoCallEnded
};

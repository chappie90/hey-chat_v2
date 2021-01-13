import { Dispatch } from 'redux';
import { PermissionsAndroid, Platform } from 'react-native';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';

import { callActions } from 'reduxStore/actions';
import { emitVoipPushReceived, emitMakeCallOffer, emitSendICECandidate } from 'socket/eventEmitters';

const onVoipPushNotificationReceived = async (data: string, socketState: any, dispatch: Dispatch): Promise<void> => {
  const { callId, chatId, caller, callee, callType } = JSON.parse(data);

  const emitData = { callerId: caller._id, calleeId: callee._id };
  emitVoipPushReceived(JSON.stringify(emitData), socketState);

  // Create RTC peer connection
  const configuration = {iceServers: [
    {
      url: 'stun:stun.l.google.com:19302',  
    }, {
      url: 'stun:stun1.l.google.com:19302',    
    }, {
      url: 'stun:stun2.l.google.com:19302',    
    },
  ]};
  const peerConn = new RTCPeerConnection(configuration);
  dispatch(callActions.setRTCPeerConnection(peerConn));

  dispatch(callActions.initiateCall(callId, chatId, caller, callee, callType));

  // Call after answering / creating webrtc connection?
  // RNCallKeep.backToForeground();
};

const onConfirmVoipPushReceived = async (
  data: string, 
  RTCPeerConnection: any, 
  socketState: any, 
  dispatch: Dispatch
): Promise<void> => {
  const { calleeId } = JSON.parse(data);

   // Send sdp offer to callee
   try {
    const offer = await RTCPeerConnection.createOffer();

    await RTCPeerConnection.setLocalDescription(offer);

    const data = { calleeId, offer };
    emitMakeCallOffer(JSON.stringify(data), socketState);
  } catch (err) {
    console.error(err);
  }

};

const onCallOfferReceived = async (data: string, call: TCall, dispatch: Dispatch): Promise<void> => {
  const { offer } = JSON.parse(data);

  console.log('on call offer received')

  const { callId, caller, callee } = call;

  // const hasVideo = type === 'video' ? true : false;
  RNCallKeep.displayIncomingCall(callId, caller._id.toString(), caller.username, 'generic', false);

  // Start playing ringtone
  InCallManager.start({media: 'audio/video'});
  InCallManager.startRingtone('_DEFAULT_');
};

const onICECandidateReceived = (data: string, RTCPeerConnection: any, dispatch: Dispatch) => {
  const { userId, contactId, candidate } = JSON.parse(data);
  if (RTCPeerConnection) {
     // MAKE SURE TO SET REMOTE DESCRIPTION BEFORE ADDING ICE CANDIDATES
    RTCPeerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    .catch((err: any) => {
      console.log(`Add ice candidate video call method error ${err}`);
    });
  }
};

const onCallAccepted = (data: string,  userId: string, socketState: any, RTCPeerConnection: any, dispatch: Dispatch) => {
  const { recipientId, recipientName, recipientProfile, answer } = JSON.parse(data);
  RTCPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));

   // Send candidates to caller
   // MAKE SURE TO SET REMOTE DESCRIPTION BEFORE ADDING ICE CANDIDATES
   RTCPeerConnection.onicecandidate = (event: any) => {
    if (event.candidate) {
      const data = { userId, contactId: recipientId, candidate: event.candidate };
      emitSendICECandidate(JSON.stringify(data), socketState);
    }
  };

  dispatch(callActions.startCall());

  // When callee answers, stop ringback
  InCallManager.stopRingback();
};

const onCallRejected = (navigate: any, dispatch: Dispatch) => {
  dispatch(callActions.setRTCPeerConnection(null));

  // If callee rejects call, stop ringback
  InCallManager.stopRingback();
  InCallManager.stop();

  navigate('CurrentChat', {});
};

const onCallCancelled = (dispatch: Dispatch) => {
  // Stop ringing if caller cancells call
  InCallManager.stopRingtone();
  InCallManager.stop();
  
  dispatch(callActions.receiveIncomingCall('', '', '', '', '', null));
};

const onCallEnded = (
  data: string, 
  localStream: any,
  RTCPeerConnection: any, 
  navigate: any, 
  dispatch: Dispatch
) => {
  const { chatType, chatId, senderId, senderName, senderProfile } = JSON.parse(data);
  InCallManager.stop();

  // Stop local stream
  localStream.getTracks().forEach((t: any) => t.stop());
  localStream.release();
  dispatch(callActions.setLocalStream(null));

  // Close Peer connection and clean up event listeners
  RTCPeerConnection.close();
  // RTCPeerConnection.onicecandidate = null; 
  // RTCPeerConnection.onaddstream = null; 
  dispatch(callActions.setRTCPeerConnection(null));

  dispatch(callActions.setRemoteStream(null));
  dispatch(callActions.setActiveCallStatus(false));

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
  onVoipPushNotificationReceived,
  onConfirmVoipPushReceived,
  onCallOfferReceived,
  onICECandidateReceived,
  onCallAccepted,
  onCallRejected,
  onCallCancelled,
  onCallEnded
};

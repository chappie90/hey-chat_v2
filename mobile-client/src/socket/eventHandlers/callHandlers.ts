import { Dispatch } from 'redux';
import { PermissionsAndroid, Platform } from 'react-native';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'react-native-uuid';

import api from 'api';
import { navigate } from 'navigation/NavigationRef';
import { callActions, chatsActions } from 'reduxStore/actions';
import { emitSendICECandidate, emitSendSdpAnswer } from 'socket/eventEmitters';

// const onVoipPushNotificationReceived = async (data: string, socketState: any, dispatch: Dispatch): Promise<void> => {
//   const { callId, chatId, caller, callee, callType } = JSON.parse(data);

//   const emitData = { callerId: caller._id, calleeId: callee._id };
//   emitVoipPushReceived(JSON.stringify(emitData), socketState);

//   // Create RTC peer connection
//   const configuration = {iceServers: [
//     {
//       url: 'stun:stun.l.google.com:19302',  
//     }, {
//       url: 'stun:stun1.l.google.com:19302',    
//     }, {
//       url: 'stun:stun2.l.google.com:19302',    
//     },
//   ]};
//   const peerConn = new RTCPeerConnection(configuration);
//   dispatch(callActions.setRTCPeerConnection(peerConn));

//   dispatch(callActions.receiveCall(callId, chatId, caller, callee, callType));
// };

// const onConfirmVoipPushReceived = async (
//   data: string, 
//   RTCPeerConnection: any, 
//   socketState: any, 
//   dispatch: Dispatch
// ): Promise<void> => {
//   const { calleeId } = JSON.parse(data);

//    // Send sdp offer to callee
//    try {
//     const offer = await RTCPeerConnection.createOffer();

//     await RTCPeerConnection.setLocalDescription(offer);

//     const data = { calleeId, offer };
//     emitMakeCallOffer(JSON.stringify(data), socketState);
//   } catch (err) {
//     console.error(err);
//   }

// };

const onSdpOfferReceived = async (data: string, call: TCall, socketState: any, dispatch: Dispatch): Promise<void> => {
  const { offer } = JSON.parse(data);

  const { callee, RTCConnection } = call;

  callActions.setCallOffer(offer);

  try {
    await RTCConnection.setRemoteDescription(new RTCSessionDescription(offer))

    const answer = await RTCConnection.createAnswer();
    await RTCConnection.setLocalDescription(answer);

    const data = { calleeId: callee._id, answer };

    emitSendSdpAnswer(JSON.stringify(data), socketState);

    // Send candidates to caller
    RTCConnection.onicecandidate = (event: any) => {
      if (event.candidate) {
        const data = { contactId: callee._id, candidate: event.candidate };
        console.log('sending ice candidate')
        console.log(data)
        emitSendICECandidate(JSON.stringify(data), socketState);
      }
    };
    
  } catch (err) {
    console.log('Offer Error', err);
  }

  if (Platform.OS === 'android') {
    RNCallKeep.setCurrentCallActive(call.callId);
    RNCallKeep.backToForeground();
  } 
  
  dispatch(callActions.startCall());

  // When callee answers, stop ringback
  InCallManager.stopRingback();
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

const onSdpAnswerReceived = (data: string,  callState: TCall, socketState: any, dispatch: Dispatch) => {
  const { recipientId, recipientName, recipientProfile, answer } = JSON.parse(data);
  callState.RTCConnection.setRemoteDescription(new RTCSessionDescription(answer));

   // Send candidates to caller
   // MAKE SURE TO SET REMOTE DESCRIPTION BEFORE ADDING ICE CANDIDATES
   callState.RTCConnection.onicecandidate = (event: any) => {
    if (event.candidate) {
      const data = { userId: callState.callee._id, contactId: recipientId, candidate: event.candidate };
      emitSendICECandidate(JSON.stringify(data), socketState);
    }
  };

  if (Platform.OS === 'android') {
     RNCallKeep.setCurrentCallActive(callState.callId);
     RNCallKeep.backToForeground();
  }
  
  dispatch(callActions.startCall());
};

export default {
  // onConfirmVoipPushReceived,
  onSdpOfferReceived,
  onICECandidateReceived,
  onSdpAnswerReceived,
};

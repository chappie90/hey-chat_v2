import { Dispatch } from 'redux';
import { PermissionsAndroid, Platform } from 'react-native';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import RNCallKeep from 'react-native-callkeep';

import { videoCallActions } from 'reduxStore/actions';
import { emitSendICECandidate } from 'socket/eventEmitters';

const onVideoCallOfferReceived = async (data: string, dispatch: Dispatch): Promise<void> => {
  const { callId, chatId, caller, callee, offer, type } = JSON.parse(data);

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
  dispatch(videoCallActions.setRTCPeerConnection(peerConn));

  const initRNCallKeep = async (): Promise<void> => {
    const options = {
      ios: {
        appName: 'Hey',
        imageName: 'sim_icon',
        supportsVideo: false,
        maximumCallGroups: '1',
        maximumCallsPerCallGroup: '1'
      },
      android: {
        alertTitle: 'Permissions Required',
        alertDescription:
          'This application needs to access your phone calling accounts to make calls',
        cancelButton: 'Cancel',
        okButton: 'ok',
        imageName: 'sim_icon',
        additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS]
      }
    };

    try {
      await RNCallKeep.setup(options);

      if (Platform.OS === 'android') RNCallKeep.setAvailable(true);
    } catch (err) {
      console.error('Initialize CallKeep method error:', err.message);
    }
  };

  dispatch(videoCallActions.receiveCall(callId, chatId, caller, callee, offer, type));

  await initRNCallKeep();

  const hasVideo = type === 'video' ? true : false;
  RNCallKeep.displayIncomingCall(callId, caller._id, caller.username, 'generic', hasVideo);

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

const onVideoCallAccepted = (data: string,  userId: string, socketState: any, RTCPeerConnection: any, dispatch: Dispatch) => {
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
  dispatch(videoCallActions.setActiveCallStatus(true));

  // When callee answers, stop ringback
  InCallManager.stopRingback();
};

const onVideoCallRejected = (navigate: any, dispatch: Dispatch) => {
  dispatch(videoCallActions.setRTCPeerConnection(null));

  // If callee rejects call, stop ringback
  InCallManager.stopRingback();
  InCallManager.stop();

  navigate('CurrentChat', {});
};

const onVideoCallCancelled = (dispatch: Dispatch) => {
  // Stop ringing if caller cancells call
  InCallManager.stopRingtone();
  InCallManager.stop();
  
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
  InCallManager.stop();

  // Stop local stream
  localStream.getTracks().forEach((t: any) => t.stop());
  localStream.release();
  dispatch(videoCallActions.setLocalStream(null));

  // Close Peer connection and clean up event listeners
  RTCPeerConnection.close();
  // RTCPeerConnection.onicecandidate = null; 
  // RTCPeerConnection.onaddstream = null; 
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

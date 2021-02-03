import RNCallKeep from 'react-native-callkeep';
import { Dispatch } from 'redux';
import InCallManager from 'react-native-incall-manager';

import { callActions, chatsActions } from 'reduxStore/actions';
import { webRTCService } from 'services';

const onCallEnded = async (userId: number, callState: TCall, navigate: any,  dispatch: Dispatch) => {
  const contact = userId === callState.caller._id ? callState.callee : callState.caller;

  RNCallKeep.rejectCall(callState.callId);
  RNCallKeep.endAllCalls();
  RNCallKeep.endCall(callState.callId);

  if (callState.isReceivingCall) {
    InCallManager.stopRingtone();
  }

  InCallManager.stop();  

  if (callState.localStream) {
    webRTCService.stopLocalStream(callState, dispatch);
  }

  // Close Peer connection and clean up event listeners
  callState.RTCConnection?.close();

  const routeParams = { 
    chatType: 'private', 
    chatId: callState.chat.chatId,
    contactId: contact._id,
    contactName: contact.username,
    contactProfile: contact.avatar
  };
  navigate('CurrentChat', routeParams);

  dispatch(callActions.endCall());
};

const onMissedCall = (data: string, username: string, chatHistory: any, dispatch: Dispatch) => {
  const { chatId, message } = JSON.parse(data);
  // Fetch chat messages if not loaded yet
  if (!chatHistory[chatId]) {
    dispatch(chatsActions.getMessages(username, '', chatId));
  } else {
    // Append last message if chat loaded
    dispatch(chatsActions.addMessage(
      chatId, 
      {
        ...message,
        sender: {
          ...message.sender,
          _id: 2
        },
        delivered: true
      }
    ));
  }
};

export default {
  onMissedCall,
  onCallEnded
};
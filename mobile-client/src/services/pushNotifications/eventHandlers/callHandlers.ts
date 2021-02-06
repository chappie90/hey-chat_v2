import RNCallKeep from 'react-native-callkeep';
import { Dispatch } from 'redux';
import InCallManager from 'react-native-incall-manager';
import config from 'react-native-config';
import PushNotification from "react-native-push-notification";

import { store } from 'reduxStore';
import { callActions, chatsActions } from 'reduxStore/actions';
import { pushNotificationsService, webRTCService } from 'services';

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

const onVideoRequested = async (userId: number, callState: TCall, dispatch: Dispatch) => {
  dispatch(callActions.receiveVideoRequest(true));

  const contact = userId === callState.caller._id ? callState.callee : callState.caller;

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  while (store.getState().call.call.isReceivingVideoRequest) {
    pushNotificationsService.eventPushers.mainPushers.sendLocalPushNotification(
      config.RN_APP_ID,
      contact.username, 
      'Video call requested',
      '["Answer", "Reject"]',
      false
    );
    
    await sleep(5000);  

    // Returns a list of the app’s notifications that are still displayed in notification Center
    PushNotification.getDeliveredNotifications(notifications => {
      for (let notification of notifications) {
        // Removed video call requested notifcation from notification center
        if (notification.body === 'Video call requested') {
          PushNotification.removeDeliveredNotifications([notification.identifier]);
        }
      }
    });
  }
};

export default {
  onMissedCall,
  onCallEnded,
  onVideoRequested
};
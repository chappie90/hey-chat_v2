import React, { useEffect, useRef } from 'react'
import { PermissionsAndroid, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import uuid from 'react-native-uuid';
import { useSelector, useDispatch } from 'react-redux';
import InCallManager from 'react-native-incall-manager';
import VoipPushNotification from 'react-native-voip-push-notification';

import api from 'api';
import { callActions } from 'reduxStore/actions';

const VoIPManager = ({ }) => {
  const { call: {
    callId,
    isActive,
    isInitiatingCall,
    RTCConnection,
    localStream, 
    remoteStream,
    muted,
    cameraFacingMode,
  } } = useSelector(state => state.call);
  const { user: { _id: userId } } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const callIdRef = useRef('');

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

  const onDidReceiveStartCall = () => {
    const options = {
      ios: {
        hasVideo: true
      }
    };

    RNCallKeep.updateDisplay(callIdRef.current, 'Johny', 'Pesho', options);
  };

  const onAnswerCall = () => {

  };

  const onEndCall = () => {
    if (callIdRef.current) {
      RNCallKeep.endCall(callIdRef.current);
      InCallManager.stop();
      dispatch(callActions.endCall());
    }
  };
  
  const onIncomingCallDisplayed = () => {

  };

  const onToggleMute = () => {

  };

  const onToggleHold = () => {

  };

  const onAudioSessionActivated = () => {

  };

  const onDTMF = () => {

  };

  useEffect(() => {
    (async () => {
      await initRNCallKeep();
    })();

    VoipPushNotification.addEventListener('didLoadWithEvents', async (events: any) => {
      // This will fire when there are events occured before js bridge initialized
      if (!events || !Array.isArray(events) || events.length < 1) {
          return;
      }
      for (let voipPushEvent of events) {
        let { name, data } = voipPushEvent;
        if (name === VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent) {
          const voipDeviceToken = data;

          try {
            const data = { userId, voipDeviceToken };
            await api.post('/push-notifications/voip/token/save', data); 
          } catch (error) {
            console.log('Send voip device token to server method error');
            if (error.response) console.log(error.response.data.message);
            if (error.message) console.log(error.message);
          }

        } else if (name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent) {
          // // Wake up callee device to receive call offer
          // callHandlers.onVoipPushNotificationReceived(notification.data.payload, dispatch);
        } 
      }
    });

    // When receive remote voip push, register your VoIP client, show local notification ... etc
    VoipPushNotification.addEventListener('notification', (notification: any) => {
      console.log(notification)
      console.log('voip notification received')
    });
  
    RNCallKeep.addEventListener('didReceiveStartCallAction', onDidReceiveStartCall);
    RNCallKeep.addEventListener('answerCall', onAnswerCall);
    RNCallKeep.addEventListener('endCall', onEndCall);
    RNCallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
    RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
    RNCallKeep.addEventListener('didToggleHoldCallAction', onToggleHold);
    RNCallKeep.addEventListener('didPerformDTMFAction', onDTMF);
    RNCallKeep.addEventListener('didActivateAudioSession', onAudioSessionActivated);

    return () => {
      VoipPushNotification.removeEventListener('didLoadWithEvents');
      VoipPushNotification.removeEventListener('register');
      VoipPushNotification.removeEventListener('notification');

      RNCallKeep.addEventListener('didReceiveStartCallAction', onDidReceiveStartCall);
      RNCallKeep.addEventListener('answerCall', onAnswerCall);
      RNCallKeep.addEventListener('endCall', onEndCall);
      RNCallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
      RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
      RNCallKeep.addEventListener('didToggleHoldCallAction', onToggleHold);
      RNCallKeep.addEventListener('didPerformDTMFAction', onDTMF);
      RNCallKeep.addEventListener('didActivateAudioSession', onAudioSessionActivated);
    }
  }, []);

  useEffect(() => {
    callIdRef.current = callId;
  }, [callId])

  return <></>;
};

export default VoIPManager;
import React, { useEffect, useRef } from 'react'
import { PermissionsAndroid, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import { useSelector, useDispatch } from 'react-redux';
import InCallManager from 'react-native-incall-manager';
import VoipPushNotification from 'react-native-voip-push-notification';
import config from 'react-native-config';
import { RTCSessionDescription, mediaDevices } from 'react-native-webrtc';

import { callHandlers } from 'socket/eventHandlers';
import api from 'api';
import { callActions } from 'reduxStore/actions';
import { navigate } from 'navigation/NavigationRef';

const VoIPManager = ({ }) => {
  const { call: {
    callId,
    isActive,
    isInitiatingCall,
    chat: { chatId },
    caller,
    callee,
    RTCConnection,
    localStream, 
    remoteStream,
    muted,
    cameraFacingMode,
  } } = useSelector(state => state.call);
  const { user: { _id: userId } } = useSelector(state => state.auth);
  const { socketState } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const callIdRef = useRef('');
  const chatIdRef = useRef('');
  const callerRef = useRef<TContact | null>(null); 
  const calleeRef = useRef<TContact | null>(null); 

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
        additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS],
        // Required to get audio in background when using Android 11
        foregroundService: {
          channelId: config.RN_APP_ID,
          channelName: `${config.RN_APP_ID}.voip-channel`,
          notificationTitle: 'My app is running on background',
          notificationIcon: 'Path to the resource icon of the notification',
        }, 
      }
    };

    try {
      await RNCallKeep.setup(options);

      if (Platform.OS === 'android') RNCallKeep.setAvailable(true);
    } catch (err) {
      console.error('Initialize CallKeep method error:', err.message);
    }
  };

  const onDidReceiveStartCall = async (): Promise<void> => {
    console.log('did receive call')
    const options = {
      ios: {
        hasVideo: true
      }
    };

    if (callerRef.current && calleeRef.current) {
      RNCallKeep.updateDisplay(callIdRef.current, callerRef.current.username, calleeRef.current.username, options);
    }

    // const data = { 
    //   callId: callIdRef.current, 
    //   chatId: chatIdRef.current, 
    //   caller: callerRef.current, 
    //   callee: calleeRef.current, 
    //   callType: 'video' 
    // };
    // console.log('hitting route')
    // await api.post('/push-notifications/voip/send', data); 
  };

  const startLocalStream = async (): Promise<any> => {
    try {
      // isFront will determine if the initial camera should face user or environment
      const isFront = true;
      const devices = await mediaDevices.enumerateDevices();

      const facing = isFront ? 'front' : 'environment';
      const videoSourceId = devices.find((device: any) => device.kind === 'videoinput' && device.facing === facing);
      const facingMode = isFront ? 'user' : 'environment';
      const constraints: any = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode,
          optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      };

      const newStream = await mediaDevices.getUserMedia(constraints);

      dispatch(callActions.setLocalStream(newStream));

      return newStream;
    } catch (err) {
      console.log('Start local stream recipient method error');
      console.log(err);
    }
  };

  const onAnswerCall = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      RNCallKeep.answerIncomingCall(callIdRef.current);
    }

    const stream = await startLocalStream();
    RTCConnection.addStream(stream);

    RTCConnection.onaddstream = (event: any) => {
      if (event.stream && remoteStream !== event.stream) {
        dispatch(callActions.setRemoteStream(event.stream));
      }
    };

    try {
      await RTCConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await RTCConnection.createAnswer();
      await RTCConnection.setLocalDescription(answer);

      const data = { 
        callerId, 
        recipientId: userId, 
        recipientName: username, 
        recipientProfile: avatar, 
        answer 
      };
      emitAcceptCall(JSON.stringify(data), socketState);

      // Send candidates to caller
      RTCConnection.onicecandidate = (event: any) => {
        if (event.candidate) {
          const data = { userId, contactId: callerId, candidate: event.candidate };
          emitSendICECandidate(JSON.stringify(data), socketState);
        }
      };
      
    } catch (err) {
      console.log('Offer Error', err);
    }

    const routeParams = { 
      chatType, 
      chatId, 
      contactId: callerId, 
      contactName: callerName, 
      contactProfile: callerProfile 
    };

    dispatch(callActions.unsetIncomingCall());
    dispatch(callActions.setActiveCallStatus(true));

    InCallManager.start({media: 'audio/video'});

    navigate('VideoCall', routeParams);
  };

  const onRejectCall = (): void => {
    InCallManager.stopRingtone();
    InCallManager.stop();

    dispatch(callActions.unsetIncomingCall());

    const data = { callerId };
    emitRejectCall(JSON.stringify(data), socketState);
  };

  const onEndCall = () => {
    if (callIdRef.current) {
      RNCallKeep.endCall(callIdRef.current);
      InCallManager.stop();
      dispatch(callActions.endCall());
    }
  };
  
  const onIncomingCallDisplayed = () => {
    console.log('incoming call displayed')
  };

  const onToggleMute = () => {
    console.log('toggled mute')
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
          // Wake up callee device to receive call offer
          console.log('voip received')
          console.log(data);
        } 
      }
    });

    // When receive remote voip push, register your VoIP client, show local notification ... etc
    VoipPushNotification.addEventListener('notification', (notification: any) => {
      console.log(notification)
      console.log('voip notification received')
      callHandlers.onVoipPushNotificationReceived(notification.data, socketState, dispatch);
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
    chatIdRef.current = chatId;
    callerRef.current = caller;
    calleeRef.current = callee;
  }, [callId, chatId, caller, callee]);

  return <></>;
};

export default VoIPManager;
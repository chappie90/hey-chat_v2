import React, { useEffect, useRef, ReactNode } from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
import VoipPushNotification from 'react-native-voip-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import config from 'react-native-config';
import RNCallKeep from 'react-native-callkeep';
import { PermissionsAndroid, Platform, AppState } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import { mediaDevices, RTCPeerConnection } from 'react-native-webrtc';
import BackgroundFetch from 'react-native-background-fetch';

import { connectToSocket } from 'socket/connection';
import api from 'api';
import { chatsHandlers, callHandlers } from 'socket/eventHandlers';
import { navigate } from 'navigation/NavigationRef';
import { chatsActions, appActions, callActions } from 'reduxStore/actions';
import { emitMarkAllMessagesAsRead, emitSendSdpOffer, emitEndCall, emitSendICECandidate } from 'socket/eventEmitters';
import { store } from 'reduxStore';

type PushNotificationsManagerProps = { children: ReactNode };

const PushNotificationsManager = ({ children }: PushNotificationsManagerProps) => {
  const { currentScreen, socketState } = useSelector(state => state.app);
  const { user } = useSelector(state => state.auth);
  const { chatHistory } = useSelector(state => state.chats);
  const { call } = useSelector(state => state.call);
  const dispatch = useDispatch();
  const userRef = useRef<any>(null);
  const chatHistoryRef = useRef({});
  const currentScreenRef = useRef('');
  const socketStateRef = useRef<any>(null);
  const badgeCountRef = useRef(0);
  const callRef = useRef<any>(null);

  const createNotificationsChannel = (
    channelId: string, 
    channelName: string,
    channelDescription?: string,
    soundName?: string,
    importance?: number,
    vibrate?: boolean
   ): void => {
   PushNotification.createChannel(
     {
       channelId,
       channelName,
       channelDescription, // default: undefined.
       soundName, // default: 'default'. See `soundName` parameter of `localNotification` function
       importance, // default: 4. Int value of the Android notification importance
       vibrate, // default: true. Creates the default vibration patten if true
     },
     (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
   );
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

  const sendLocalPushNotification = (
    channelId: string,
    title: string,
    body: string
  ): void => {
    PushNotification.localNotification({
      channelId,
      title,
      message: body,
      number: 10
    });
  };


  const initRNCallKeep = async (): Promise<void> => {
    const options = {
      ios: {
        appName: 'Hey',
        imageName: 'sim_icon',
        supportsVideo: true,
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

  const onDidLoadWithEvents = async (events: any): Promise<void> => {
    console.log('on did load with events')
    console.log(events)
  };

  const onDidReceiveStartCall = async (): Promise<void> => {
    const options = {
      ios: {
        hasVideo: true
      }
    };

    // if (callRef.current && callRef.current.isInitiatingCall) {
    //   RNCallKeep.updateDisplay(
    //     callRef.current.callId,
    //     callRef.current.caller.username, 
    //     callRef.current.callee.username, 
    //     options
    //   );
    // }
  };

  const onAnswerCall = async (): Promise<void> => {
    // Establish RTC Peer Connection
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

    // RNCallKeep.backToForeground();

    // Reattempt connection if unintentionally disconnected?
    peerConn.oniceconnectionstatechange = (event) => {
      console.log('Ice connection state: ' + event.target.iceConnectionState);
    };

    peerConn.onnegotiationneeded = (): void => {
      console.log('Negotiation needed');
    };

    peerConn.onaddstream = (event) => {
      try {
        if (event.stream && callRef.current.remoteStream !== event.stream) {
            dispatch(callActions.setRemoteStream(event.stream));
        }
      } catch (err) {
        console.error(`Error adding remote stream: ${err}`);
      }
    };

    // Add local stream to peer connection
    const stream = await startLocalStream();
    peerConn.addStream(stream);

    // Send sdp offer to callee
    try {
      const offer = await peerConn.createOffer();

      await peerConn.setLocalDescription(offer);

      const data = { callerId: callRef.current.caller._id, offer };
      // Make sure socket is connected
      const sendOffer = () => {
        if (socketStateRef.current) {
          clearInterval(timer);
          console.log('socket is setup on answer')
          emitSendSdpOffer(JSON.stringify(data), socketStateRef.current);
        }
        console.log('socket not setup on answer')
      };

      const timer = setInterval(sendOffer, 500);
    } catch (err) {
      console.error(err);
    }

    InCallManager.start({media: 'audio/video'});

    if (Platform.OS === 'android') {
      RNCallKeep.backToForeground();
    }

    navigate('Call', {});
  };

  const stopLocalStream = () => {
    callRef.current.localStream.getTracks().forEach((t: any) => t.stop());
    callRef.current.localStream.release();
    dispatch(callActions.setLocalStream(null));
  };

  const onEndCall = async () => {
    const call = callRef.current;

    if (!callRef.current.hasEnded) {
      // Make sure socket is connected
      if (Platform.OS === 'ios' && callRef.current.isInitiatingCall) {
        try {
          const data = { calleeId: callRef.current.callee._id };
          await api.post('/push-notifications/voip/end-call', data); 
        } catch (err) {
          console.error(err);
        }
      } else {
        const endCall = () => {
          if (socketStateRef.current) {
            clearInterval(timer);
            console.log('socket is setup on end call')
            const contactId = userRef.current._id === call.caller._id ? call.callee._id : call.caller._id;

            const data = { contactId };
            console.log('end call timer data')
            console.log(data)
            emitEndCall(JSON.stringify(data), socketStateRef.current);
          } else {
            console.log('socket not setup on end call')
          }
        };
      
        const timer = setInterval(endCall, 500);
      }
    }

    if (callRef.current.isReceivingCall) {
      InCallManager.stopRingtone();
    }

    InCallManager.stop();  

    if (callRef.current.localStream) stopLocalStream();

    // Close Peer connection and clean up event listeners
    callRef.current.RTCPeerConnection?.close();
    
    const contact = userRef.current._id === call.caller._id ? call.callee : call.caller;
    const routeParams = { 
      chatType: 'private', 
      chatId: callRef.current.chat.chatId,
      contactId: contact._id,
      contactName: contact.username,
      contactProfile: contact.avatar
    };
    navigate('CurrentChat', routeParams);

    if (!callRef.current.hasEnded) dispatch(callActions.endCall());
  };

   // Only iOS
   const onIncomingCallDisplayed = () => {
    console.log('incoming call displayed')
    // Start ringback tone
    // InCallManager.start({media: 'audio', ringback: '_DEFAULT_'});
  };

  const onToggleMute = () => {
    console.log('toggled mute')
  };

  const onToggleHold = () => {
    console.log('toggled hold')
  };

  const onAudioSessionActivated = () => {
     // InCallManager.start({media: 'audio', ringback: '_DEFAULT_'});
  };

  const onDTMF = () => {

  };

  const configure = (): void => {
    PushNotification.configure({
      // User accepted notification permission - register token
      onRegister: async (tokenData): Promise<void> => {
        // Send token to server
        try {
          const jsonValue = await AsyncStorage.getItem('user')
          const user = jsonValue !== null ? JSON.parse(jsonValue) : null;

          if (user) {
            const data = { userId: user._id, deviceOS: tokenData.os, deviceToken: tokenData.token };
            await api.post('/push-notifications/token/save', data);
          }
      
        } catch(error) {
          console.log('Could not send push notifications token to server on register: ' + error);
          if (error.response) console.log(error.response.data.message);
          if (error.message) console.log(error.message);
        }

      // Create notifications channel - Android
      createNotificationsChannel(config.RN_APP_ID, `${config.RN_APP_ID}.notifications-channel`)
    },
    // Notification received / opened in-app event
    onNotification: function (notification) {
      // console.log(notification) 

      // Set notifications badge. Doesn't work on all Android devices
      const { chat: { chatId } } = notification.data.payload;
      const { app: { badgeCount }, chats: { chats } } = store.getState();
      const unreadMessagesCount = chats.filter((chat: TChat) => chat.chatId === chatId)[0].unreadMessagesCount;

      // Increase badge count by 1 for every chat that has unread messages
      if (AppState.currentState === 'background' && unreadMessagesCount === 0) {
        PushNotification.setApplicationIconBadgeNumber(badgeCount + 1);
        dispatch(appActions.setBadgeCount(badgeCount + 1));
      } 

      // Update recipient app state while in background
      if (notification.data.silent) {
        // Send local notification Android background
        if (Platform.OS === 'android' && notification.data.payload !== null) {
          console.log(notification.data.payload)
          const { newMessage } = notification.data.payload;
          if (newMessage) {
            sendLocalPushNotification("hey-chat-id-1", newMessage.sender, newMessage.message.text);
          }
        }

        switch (notification.data.type) {
          case 'message_received':
            // Update recipient's chats list and add new message to chat history
            chatsHandlers.onMessageReceived(
              notification.data.payload, 
              userRef.current.username,
              chatHistoryRef.current,
              dispatch,
              socketState,
              ''
            );
            break;
          case 'first_message_received':
            chatsHandlers.onFirstMessageReceived(notification.data.payload, dispatch);
          case 'message_deleted':
            // Delete message for recipient
            chatsHandlers.onMessageDeleted(notification.data.payload, dispatch);
            break;
          case 'message_liked':
            // Update recipient's chat messages with liked message
            chatsHandlers.onMessageLiked(notification.data.payload, dispatch);
            break;
          case 'messages_marked_as_read_sender':
            // Mark all sender's chat history messages as read
            chatsHandlers.onMessagesMarkedAsReadSender(notification.data.payload, dispatch);
            break;
          case 'voip_notification_received':
            // Wake up device and handle incoming call
            const { callId, chatId, caller, callee, callType } = notification.data.payload;
            dispatch(callActions.receiveCall(callId, chatId, caller, callee, callType));

            const options = {};

            RNCallKeep.displayIncomingCall(
              callId, 
              `Hey ${callType.charAt(0).toUpperCase() + callType.slice(1)}...`, 
              caller.username
            );

            BackgroundFetch.scheduleTask({
              taskId: "connect_socket",
              forceAlarmManager: true,
              delay: 0  // <-- milliseconds
            });
            break;
          case 'voip_call_ended':
            // End call on Android devices if caller hangs up before socket reconnection can be established
            (async () => {
              try {
                const jsonValue = await AsyncStorage.getItem('user')
                const user = jsonValue !== null ? JSON.parse(jsonValue) : null;
    
                if (user) {
                  console.log(user)
                  callHandlers.onCallEnded(user._id, callRef.current, navigate, dispatch);
                }
            
              } catch(err) {
                console.log('Could not read user data from async storage inside voip switch: ' + err);
              }
            })();
            break;
          default:
            return;
        }
      }

      // Send local notification Android foreground
      if (Platform.OS === 'android' && currentScreenRef.current !== 'CurrentChat') {
        sendLocalPushNotification("hey-chat-id-1", notification.title, notification.message);
      }

      // // Serve local notification
      // if (Platform.OS === 'ios') {
      //   if (notification.title) {
      //     console.log(notification.title)
      //     PushNotification.localNotification({
      //       title: notification.title,
      //       message: notification.message
      //     });
      //   }
      // }

      // Handle user tap on notification
      if (notification.userInteraction) { 
        const { chat, senderId } = notification.data.payload;
        if (chat.chatType === 'private') {
          console.log('private chat')
          // Send signal to sender message has been read and mark recipient's chat as read
          dispatch(chatsActions.markMessagesAsReadRecipient(chat.chatId));
          const eventData = { chatId: chat.chatId, senderId };
          emitMarkAllMessagesAsRead(JSON.stringify(eventData), socketState);
    
          // Navigate to current chat screen
          const contactName: string = chat.participants.filter((p: any) => p !== senderId)[0].username;
          const routeParams = {
            chatType: chat.type,
            chatId: chat.chatId,
            contactName,
            contactId: senderId
          };
          navigate('CurrentChat', routeParams);
        }
      }

      // const isClicked = notification.getData().userInteraction === 1;

      // if (isClicked) {
      //   // Navigate user to another screen
      // } else {
      //   // Do something else with push notification
      // }

     
      
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    onAction: function (notification) {
      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
    },

    onRegistrationError: function (err) {
      console.error(err.message, err);
    },
    // Outlining what permissions to accept
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },
    // popInitialNotification: true,
    requestPermissions: true
  });
};

  useEffect(() => {
    userRef.current = user;
    chatHistoryRef.current = chatHistory;
    currentScreenRef.current = currentScreen;
    socketStateRef.current = socketState;
    callRef.current = call;
  }, [user, chatHistory, currentScreen, socketState, call]);

  useEffect(() => {
    configure();

    initRNCallKeep();

    VoipPushNotification.addEventListener('didLoadWithEvents', async (events: any) => {

      console.log('did load with events native')
      // This will fire when there are events occured before js bridge initialized
      if (!events || !Array.isArray(events) || events.length < 1) {
          return;
      }
      for (let voipPushEvent of events) {
        let { name, data } = voipPushEvent;
        if (name === VoipPushNotification.RNVoipPushRemoteNotificationsRegisteredEvent) {
          const voipDeviceToken = data;

          try {
            const data = { userId: userRef.current._id, voipDeviceToken };
            await api.post('/push-notifications/voip/token/save', data); 
          } catch (error) {
            console.log('Send voip device token to server method error');
            if (error.response) console.log(error.response.data.message);
            if (error.message) console.log(error.message);
          }

        } else if (name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent) {
          // Wake up callee device to receive call offer
          console.log('voip received did load with events')
          // console.log(data);
        } 
      }
    });

    // When receive remote voip push, register your VoIP client, show local notification ... etc
    VoipPushNotification.addEventListener('notification', (notification: any) => {
      const { callId, chatId, caller, callee, callType } = JSON.parse(notification.data);
      console.log(notification.data)

      dispatch(callActions.receiveCall(callId, chatId, caller, callee, callType));

      (async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('user')
          const user = jsonValue !== null ? JSON.parse(jsonValue) : null;
        
          if (user) {
            const socket = connectToSocket(user._id);
            dispatch(appActions.setSocketState(socket));
          }
      
        } catch(err) {
          console.log('Could not read user data from async storage inside voip switch: ' + err);
        }
      })();
    });

    RNCallKeep.addEventListener('didLoadWithEvents', onDidLoadWithEvents);
    RNCallKeep.addEventListener('didReceiveStartCallAction', onDidReceiveStartCall);
    RNCallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
    RNCallKeep.addEventListener('answerCall', onAnswerCall);
    RNCallKeep.addEventListener('endCall', onEndCall);
    RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
    RNCallKeep.addEventListener('didToggleHoldCallAction', onToggleHold);
    RNCallKeep.addEventListener('didPerformDTMFAction', onDTMF);
    RNCallKeep.addEventListener('didActivateAudioSession', onAudioSessionActivated);

    return () => {
      VoipPushNotification.removeEventListener('didLoadWithEvents');
      VoipPushNotification.removeEventListener('notification');

      RNCallKeep.removeEventListener('didLoadWithEvents');
      RNCallKeep.removeEventListener('didReceiveStartCallAction');
      RNCallKeep.removeEventListener('answerCall');
      RNCallKeep.removeEventListener('endCall');
      RNCallKeep.removeEventListener('didDisplayIncomingCall');
      RNCallKeep.removeEventListener('didPerformSetMutedCallAction');
      RNCallKeep.removeEventListener('didToggleHoldCallAction');
      RNCallKeep.removeEventListener('didPerformDTMFAction');
      RNCallKeep.removeEventListener('didActivateAudioSession');
    };
  }, []);

  return <>{children}</>;
};

export default PushNotificationsManager;

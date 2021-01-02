import React, { useEffect, useRef, ReactNode } from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';

import api from 'api';
import { chatsHandlers } from 'socket/eventHandlers';
import { navigate } from 'navigation/NavigationRef';
import { chatsActions } from 'reduxStore/actions';
import { emitMarkAllMessagesAsRead } from 'socket/eventEmitters';
import { Platform } from 'react-native';

type PushNotificationsManagerProps = { children: ReactNode };

const PushNotificationsManager = ({ children }: PushNotificationsManagerProps) => {
  const { currentScreen, socketState } = useSelector(state => state.app);
  const { userId, username } = useSelector(state => state.auth);
  const { chatHistory } = useSelector(state => state.chats);
  const dispatch = useDispatch();
  const usernameRef = useRef('');
  const chatHistoryRef = useRef({});
  const currentScreenRef = useRef('');

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

  const sendLocalPushNotification = (
    channelId: string,
    title: string,
    body: string
  ): void => {
    PushNotification.localNotification({
      channelId,
      title,
      message: body
    });
  };

  const configure = (): void => {
    PushNotification.configure({
      // User accepted notification permission - register token
      onRegister: async (tokenData): Promise<void> => {
        // Save to storage to send to server when user id is available from store
        try {
          await AsyncStorage.setItem('deviceInfo', JSON.stringify(tokenData));
        } catch (error) {
          console.log('Save device token async storage method error');
          if (error.response) console.log(error.response.data.message);
          if (error.message) console.log(error.message);
        }

        // Clear badge number at start - iOS
        PushNotification.getApplicationIconBadgeNumber(function (number) {
          if (number > 0) {
            PushNotification.setApplicationIconBadgeNumber(0);
          }
        });

      // Create notifications channel - Android
      createNotificationsChannel('hey-chat-id-1', 'hey-chat-channel')
    },
    // Notification received / opened in-app event
    onNotification: function (notification) {
      console.log('received push notif')
      console.log(notification)

      // Update recipient app state while in background
      if (notification.data.silent) {
        // Send local notification Android background
        if (Platform.OS === 'android') {
          const { newMessage } = JSON.parse(notification.data.payload);
          sendLocalPushNotification("hey-chat-id-1", newMessage.sender, newMessage.message.text);
        }

        switch (notification.data.type) {
          case 'message_received':
            // Update recipient's chats list and add new message to chat history
            chatsHandlers.onMessageReceived(
              notification.data.payload, 
              usernameRef.current,
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
        const { chat, senderId } = JSON.parse(notification.data.payload);
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

      // Get badge number
      // PushNotification.getApplicationIconBadgeNumber(callback: Function
      
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
    if (userId) {
      (async () => {
        try {
          // If token is not in storage or new token has been issued send it to server
          const deviceStr = await AsyncStorage.getItem('deviceInfo');
          if (deviceStr !== null) {
            const deviceObj = JSON.parse(deviceStr);
            const { os: deviceOS, token: deviceToken } = deviceObj;

            const data = { userId, deviceOS, deviceToken };
            await api.post('/push-notifications/token/save', data);
          } 
        } catch (error) {
          console.log('Send device info to server method error');
          if (error.response) console.log(error.response.data.message);
          if (error.message) console.log(error.message);
        }
      })();
       }
  }, [userId]);

  useEffect(() => {
    usernameRef.current = username;
    chatHistoryRef.current = chatHistoryRef;
    currentScreenRef.current = currentScreen;
  }, [username, chatHistory, currentScreen]);

  useEffect(() => {
    configure();
  }, []);

  return <>{children}</>;
};

export default PushNotificationsManager;

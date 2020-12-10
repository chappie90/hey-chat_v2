import React, { useEffect, useRef, useState, useContext, ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from "react-native-push-notification";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';

import api from 'api';
import actions from 'reduxStore/actions';

type PushNotificationsManagerProps = { children: ReactNode };

const PushNotificationsManager = ({ children }: PushNotificationsManagerProps) => {
  const { userId, currentScreen } = useSelector(state => state.auth);
  const dispatch = useDispatch();

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

  const configure = (): void => {
    PushNotification.configure({
      // User accepted notification permission - register token
      onRegister: async (tokenData): Promise<void> => {
        console.log(userId)
        
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
      // dispatch(actions.authActions.getCurrentScreen(notification.data.key_1));

      // Serve local notification
      if (!notification.foreground) {
        PushNotification.localNotification({
          title: notification.data.title,
          message: notification.data.message
        });
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
    configure();
  }, []);

  return <>{children}</>;
};

export default PushNotificationsManager;

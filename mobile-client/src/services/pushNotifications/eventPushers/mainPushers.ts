import PushNotification from "react-native-push-notification";

// Send local push notification
const sendLocalPushNotification = (
  channelId: string,
  title: string,
  body: string,
  actions?: string,
  invokeApp?: boolean
): void => {  
  PushNotification.localNotification({
    channelId,
    title,
    message: body,
    number: 10,
    actions,
    invokeApp: invokeApp ?? true
  });
};

export default {
  sendLocalPushNotification
};
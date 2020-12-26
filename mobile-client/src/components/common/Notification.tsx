import React from 'react';
import FlashMessage from "react-native-flash-message";
import IncomingCallNotification from 'components/video/IncomingCallNotification';

type NotificationProps = {
  renderCustomContent: () => any;
};

const Notification = ({ renderCustomContent }: NotificationProps) => {
  return (
    <FlashMessage renderCustomContent={IncomingCallNotification} position="top" />
  );
};

export default Notification;

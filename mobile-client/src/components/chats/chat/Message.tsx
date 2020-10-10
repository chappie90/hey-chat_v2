import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import MessageBubble from './MessageBubble';
import MessageStatus from './MessageStatus';
import Avatar from './Avatar';

type MessageProps = {
  content: TMessage;
  sameSenderPrevMsg: boolean | undefined;
  sameSenderNextMsg: boolean | undefined;
};

const Message = ({ 
  content: { text, createDate, sender, delivered, read }, 
  sameSenderPrevMsg, 
  sameSenderNextMsg 
}: MessageProps) => {

  return (
    <View style={[
      styles.container,
      {  marginTop: sameSenderPrevMsg ? 3 : 12 }
    ]}>
      {sender._id === 2 && !sameSenderNextMsg && (
        <Avatar avatar={sender.avatar} />
      )}
      <MessageBubble 
        text={text} 
        createDate={createDate} 
        userId={sender._id}
        sameSenderPrevMsg={sameSenderPrevMsg}
        sameSenderNextMsg={sameSenderNextMsg}
      />
      {sender._id === 1 && <MessageStatus delivered={delivered} read={read} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  }
});

export default Message;
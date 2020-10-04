import React, { useReducer } from 'react';
import { View, StyleSheet } from 'react-native';
import { Context } from '../../../context/AuthContext';

import MessageBubble from './MessageBubble';
import { TMessage } from './types';

type MessageProps = {
  content: TMessage;
  sameSender: boolean | undefined;
};

const Message = ({ content, sameSender }: MessageProps) => {
  return (
    <View style={[
      styles.container,
      { marginTop: sameSender ? 3 : 12 }
    ]}>
      <MessageBubble 
        text={content.text} 
        createDate={content.createDate} 
        userId={content.sender._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  }
});

export default Message;
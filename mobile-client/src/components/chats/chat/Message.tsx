import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);

import MessageBubble from './MessageBubble';
import MessageStatus from './MessageStatus';
import Avatar from './Avatar';
import CustomText from '../../../components/CustomText';
import { Colors } from '../../../variables/variables';

type MessageProps = {
  content: TMessage;
  sameSenderPrevMsg: boolean | undefined;
  sameSenderNextMsg: boolean | undefined;
  isLastMessage: boolean;
  onShowMessageActions: (bottomPos: number, leftPos: number) => void;
  hideMessageActions: () => void;
};

const Message = ({ 
  content: { text, createDate, sender, delivered, read }, 
  sameSenderPrevMsg, 
  sameSenderNextMsg,
  isLastMessage,
  onShowMessageActions,
  hideMessageActions
}: MessageProps) => {
  const msgRef = useRef(null);

  return (
    <View
      ref={msgRef}
      onLayout={(e) => {
        const { x, y } = e.nativeEvent.layout;
        if (msgRef.current) {
          msgRef.current.x = x;
          msgRef.current.y = y;
        }
      }}
      style={[
        styles.container,
        sender._id === 1 ? styles.rightMessage : styles.leftMessage,
        {  
          marginTop: sameSenderPrevMsg ? 3 : 12,
          marginBottom: isLastMessage ? 8 : 0
        }
    ]}>
      {sender._id === 2 && !sameSenderNextMsg && (
        <Avatar avatar={sender.avatar} />
      )}
      <View style={styles.messageContainer}>
        <MessageBubble 
          text={text} 
          userId={sender._id}
          sameSenderPrevMsg={sameSenderPrevMsg}
          sameSenderNextMsg={sameSenderNextMsg}
          onShowMessageActions={onShowMessageActions}
          hideMessageActions={hideMessageActions}
          leftPos={msgRef.current && msgRef.current.x}
          topPos={msgRef.current && msgRef.current.y}
        />
        {!sameSenderNextMsg && 
          <View 
            style={[
              styles.messageMeta,
              { justifyContent: sender._id === 1 ? 'flex-end' : 'flex-start' }
            ]}
          >
            <CustomText 
              style={styles.date}
              fontSize={11}
              color={Colors.greyDark}
            >
              {dayjs(createDate).format('LT')}
            </CustomText>
            {sender._id === 1 && <MessageStatus delivered={delivered} read={read} />}
          </View>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  messageContainer: {

  },
  leftMessage: {
    marginLeft: 55,
    marginRight: 40
  },
  rightMessage: {
    marginRight: 10,
    marginLeft: 40,
    alignSelf: 'flex-end'
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  date: {

  }
});

export default Message;
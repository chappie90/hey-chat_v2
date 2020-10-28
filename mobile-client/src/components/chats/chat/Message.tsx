import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import dayjs from 'dayjs';
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);

import MessageBubble from './MessageBubble';
import MessageStatus from './MessageStatus';
import Avatar from './Avatar';
import CustomText from '../../../components/CustomText';
import { Colors } from '../../../variables/variables';

type MessageProps = {
  index: number;
  content: TMessage;
  sameSenderPrevMsg: boolean | undefined;
  sameSenderNextMsg: boolean | undefined;
  isLastMessage: boolean;
  onShowMessageActions: (index: number, coordinates: number[]) => void;
  hideMessageActions: () => void;
};

const Message = ({ 
  index,
  content: { text, createDate, sender, delivered, read }, 
  sameSenderPrevMsg, 
  sameSenderNextMsg,
  isLastMessage,
  onShowMessageActions,
  hideMessageActions,
}: MessageProps) => {

  return (
    <View
      style={[
        styles.container,
        sender._id === 1 ? styles.rightMessage : styles.leftMessage,
        {
          marginTop: sameSenderPrevMsg ? 3 : 12,
          marginBottom: isLastMessage ? 12 : 0
        }
      ]}
    >
      {sender._id === 2 && !sameSenderNextMsg && (
        <Avatar avatar={sender.avatar} />
      )}
      <View style={styles.messageContainer}>
        <MessageBubble 
          index={index}
          text={text} 
          userId={sender._id}
          sameSenderPrevMsg={sameSenderPrevMsg}
          sameSenderNextMsg={sameSenderNextMsg}
          onShowMessageActions={onShowMessageActions}
          hideMessageActions={hideMessageActions}
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
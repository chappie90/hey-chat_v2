import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import dayjs from 'dayjs';
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);
import EntypoIcon from 'react-native-vector-icons/Entypo';

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
  onShowMessageActions: (message: TMessage, coordinates: number[]) => void;
  hideMessageActions: () => void;
  onCloseReplyBox: () => void;
};

const Message = ({ 
  index,
  content, 
  sameSenderPrevMsg, 
  sameSenderNextMsg,
  isLastMessage,
  onShowMessageActions,
  hideMessageActions,
  onCloseReplyBox
}: MessageProps) => {
  const { sender, createDate, delivered, read, liked } = content;

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
        {liked.likesCount > 0 &&
          <View 
            style={[
              styles.likeIcon,
              sender._id === 1 && styles.userMsgLikeIcon,
              sender._id === 2 && styles.contactMsgLikeIcon,
            ]}
          >
            <EntypoIcon name="thumbs-up" size={19} color={Colors.purpleDark} />
          </View>
        }
        <MessageBubble 
          index={index}
          content={content} 
          userId={sender._id}
          sameSenderPrevMsg={sameSenderPrevMsg}
          sameSenderNextMsg={sameSenderNextMsg}
          onShowMessageActions={onShowMessageActions}
          hideMessageActions={hideMessageActions}
          onCloseReplyBox={onCloseReplyBox}
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

  },
  likeIcon: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.purpleLight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userMsgLikeIcon: {
    left: -15
  },
  contactMsgLikeIcon: {
    right: -15
  }
});

export default Message;
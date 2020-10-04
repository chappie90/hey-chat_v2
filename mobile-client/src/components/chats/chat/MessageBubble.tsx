import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import dayjs from 'dayjs';
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);

import CustomText from '../../../components/CustomText';
import { Colors, Headings } from '../../../variables/variables';

type MessageBubbleProps = {
  text: string;
  createDate: Date;
  userId: number;
  sameSenderPrevMsg: boolean | undefined;
  sameSenderNextMsg: boolean | undefined;
};

const MessageBubble = ({ 
  text, 
  createDate, 
  userId,
  sameSenderPrevMsg,
  sameSenderNextMsg
}: MessageBubbleProps) => {
  return (
    <TouchableWithoutFeedback>
      <View 
        style={[
          styles.bubble,
          userId === 1 ? styles.rightBubble : styles.leftBubble,
          userId === 1 && sameSenderPrevMsg && styles.rightBubblePrevMsg,
          userId === 1 && sameSenderNextMsg && styles.rightBubbleNextMsg,
          userId === 2 && sameSenderPrevMsg && styles.leftBubblePrevMsg,
          userId === 2 && sameSenderNextMsg && styles.leftBubbleNextMsg
        ]}
      >
        <CustomText 
          color={userId === 1 ? Colors.white : Colors.darkGrey}
          fontSize={Headings.headingSmall}
        >
          {text}
        </CustomText>
        <CustomText 
          style={styles.date}
          fontSize={10}
          color={userId === 1 ? Colors.white : Colors.grey}
        >
          {dayjs(createDate).format('LT')}
        </CustomText>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  bubble: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18
  },
  leftBubble: {
    backgroundColor: Colors.lightGrey,
    marginRight: '15%',
    marginLeft: 48
  },
  leftBubblePrevMsg: {
    borderTopLeftRadius: 4
  },
  leftBubbleNextMsg: {
    borderBottomLeftRadius: 4
  },
  rightBubble: {
    backgroundColor: Colors.secondaryGreen,
    marginRight: 34,
    marginLeft: '20%',
    alignSelf: 'flex-end'
  },
  rightBubblePrevMsg: {
    borderTopRightRadius: 4
  },
  rightBubbleNextMsg: {
    borderBottomRightRadius: 4
  },
  date: {
    alignSelf: 'flex-end',
    marginTop: 2
  }
});

export default MessageBubble;

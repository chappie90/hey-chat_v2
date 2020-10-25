import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import CustomText from '../../../components/CustomText';
import { Colors, Headings } from '../../../variables/variables';

type MessageBubbleProps = {
  text: string;
  userId: number;
  sameSenderPrevMsg: boolean | undefined;
  sameSenderNextMsg: boolean | undefined;
};

const MessageBubble = ({ 
  text, 
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
          color={userId === 1 ? Colors.white : Colors.greyDark}
          fontSize={Headings.headingSmall}
        >
          {text}
        </CustomText>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 35
  },
  leftBubble: {
    backgroundColor: Colors.yellowLight
  },
  leftBubblePrevMsg: {
    borderTopLeftRadius: 4
  },
  leftBubbleNextMsg: {
    borderBottomLeftRadius: 4
  },
  rightBubble: {
    backgroundColor: Colors.yellowDark
  },
  rightBubblePrevMsg: {
    borderTopRightRadius: 4
  },
  rightBubbleNextMsg: {
    borderBottomRightRadius: 4
  }
});

export default MessageBubble;

import React from 'react';
import { 
  View,
  StyleSheet, 
  TouchableWithoutFeedback
} from 'react-native';
import dayjs from 'dayjs';
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat);

import CustomText from '../../../components/CustomText';
import { Colors, Fonts, Headings } from '../../../variables/variables';

type MessageBubbleProps = {
  text: string;
  createDate: Date;
  userId: number;
};

const MessageBubble = ({ text, createDate, userId }: MessageBubbleProps) => {
  return (
    <TouchableWithoutFeedback>
      <View 
        style={[
          styles.bubble,
          userId === 1 ? styles.rightBubble : styles.leftBubble
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
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10
  },
  leftBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.lightGrey,
    marginLeft: 8,
    marginRight: '10%'
  },
  rightBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.secondary,
    marginRight: 8,
    marginLeft: '10%'
  },
  date: {
    alignSelf: 'flex-end',
    marginTop: 5
  }
});

export default MessageBubble;

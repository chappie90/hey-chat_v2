import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Colors } from 'variables';

type MessageStatusProps = {
  delivered: boolean;
  read: boolean;
};

const MessageStatus = ({ delivered, read }: MessageStatusProps) => {
  return (
    <View style={styles.container}>
      <Ionicon
        style={styles.leftCheckmark}
        name="ios-checkmark"
        size={15} 
        color={read ? Colors.yellowDark : Colors.greyDark} 
      />
      {(delivered || read) && (
        <Ionicon
          style={styles.rightCheckmark}
          name="ios-checkmark"
          size={15} 
          color={read ? Colors.yellowDark : Colors.greyDark}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  leftCheckmark: {
  },
  rightCheckmark: {
    marginLeft: -8
  }
});

export default MessageStatus;
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Colors } from '../../../variables/variables';

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
        size={18} 
        color={read ? Colors.blue : Colors.grey} 
      />
      {(delivered || read) && (
        <Ionicon
          style={styles.rightCheckmark}
          name="ios-checkmark"
          size={18} 
          color={read ? Colors.blue : Colors.grey}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginHorizontal: 4
  },
  leftCheckmark: {
  },
  rightCheckmark: {
    marginLeft: -8
  }
});

export default MessageStatus;
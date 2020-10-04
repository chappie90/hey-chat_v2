import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Chat from '../components/chats/chat/Chat';

const CurrentChatScreen = () => {
  return (
    <View style={styles.container}>
      <Chat />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default CurrentChatScreen;
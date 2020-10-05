import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import Chat from '../components/chats/chat/Chat';
import { ContactsStackParams } from '../navigation/types';

type CurrentChatScreenProps = StackScreenProps<ContactsStackParams, 'CurrentChat'>;

const CurrentChatScreen = ({ route, navigation }: CurrentChatScreenProps) => {
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
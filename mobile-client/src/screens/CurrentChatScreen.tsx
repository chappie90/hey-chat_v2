import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Context as AuthContext } from 'context/AuthContext';
import Chat from 'components/chats/chat/Chat';

type CurrentChatScreenProps = StackScreenProps<ContactsStackParams, 'CurrentChat'>;

const CurrentChatScreen = ({ route, navigation }: CurrentChatScreenProps) => {
  const { getCurrentScreen } = useContext(AuthContext);
  const { chatType, chatId, contactId, contactName, contactProfile } = route.params;

  useEffect(() => {
    getCurrentScreen(route.name);

    return () => {
      getCurrentScreen(null);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Chat 
        chatType={chatType} 
        chatId={chatId} 
        contactId={contactId}
        contactName={contactName} 
        contactProfile={contactProfile} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default CurrentChatScreen;
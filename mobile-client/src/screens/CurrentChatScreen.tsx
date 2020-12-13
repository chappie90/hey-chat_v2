import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux'

import { authActions, chatsActions } from 'reduxStore/actions';
import Chat from 'components/chats/chat/Chat';

type CurrentChatScreenProps = StackScreenProps<ContactsStackParams, 'CurrentChat'>;

const CurrentChatScreen = ({ route, navigation }: CurrentChatScreenProps) => {
  const { chatType, chatId, contactId, contactName, contactProfile } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.getCurrentScreen(route.name));
    dispatch(chatsActions.setActiveContact(contactId.toString()));

    return () => {
      dispatch(authActions.getCurrentScreen(''));
      dispatch(chatsActions.setActiveContact(''));
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
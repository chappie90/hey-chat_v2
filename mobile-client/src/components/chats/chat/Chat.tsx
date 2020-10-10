import React, { useState, useEffect, useContext  } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList,
  ActivityIndicator 
} from 'react-native';
import uuid from 'react-native-uuid';

import { emitMessage } from '../../../socket/eventEmitters';
import { Context as AuthContext } from '../../../context/AuthContext';
import { Context as ChatsContext } from '../../../context/ChatsContext';
import Message from './Message';
import InputToolbar from './InputToolbar';
import { Colors } from '../../../variables/variables';
import ContactInvitation from './ContactInvitation';

type ChatProps = {
  chatType: string;
  chatId: number;
  contactId?: number;
  contactName?: string;
  contactProfile?: string;
};

const Chat = ({ 
  chatType, 
  chatId, 
  contactId, 
  contactName, 
  contactProfile 
}: ChatProps) => {
  const { state: { userId, username, socketState } } = useContext(AuthContext);
  const { state: { messages }, getMessages, addMessage } = useContext(ChatsContext);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const onGreeting = () => {
    onSendMessage('👋');
  };

  const isSameSender = (
    currentMsg: TMessage, 
    compareMsg: TMessage | undefined
  ): boolean | undefined => {
    return compareMsg && currentMsg.sender._id === compareMsg.sender._id;
  };

  const onChangeText = (text: string): void => {
    setMessage(text);
  };

  const onSendMessage = (text: string): void => {
    const newMessage: TMessage  = {
      _id: uuid.v4(),
      chatId,
      text,
      createDate: new Date(),
      sender: {
        _id: 1,
        name: username
      },
      delivered: false,
      read: false
    };

    const data = {
      chatType,
      chatId,
      senderId: userId,
      recipientId: contactId,
      message: newMessage
    };

    addMessage(chatId, newMessage);
    emitMessage(JSON.stringify(data), socketState);
  };

  useEffect(() => {
    (async () => {
      // Get messages if no previous chat history loaded
      if (!messages[chatId]) {
        setIsLoading(true);
        const response = await getMessages(username, contactProfile, chatId);
        if (response) setIsLoading(false);
      }
    })();
  }, []);
  
  return (
    <View style={styles.container}>
      {isLoading ? 
        (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={Colors.primaryOrange} />
          </View>
        ) :
        (
          messages[chatId]?.length > 0 ?
            (
              <FlatList
                keyExtractor={item => item._id.toString()}
                data={messages[chatId]}
                renderItem={({ item, index }) => {
                  const sameSenderPrevMsg = isSameSender(item, messages[(index - 1)]);
                  const sameSenderNextMsg = isSameSender(item, messages[(index + 1)]);
                  return (
                    <Message 
                      content={item} 
                      sameSenderPrevMsg={sameSenderPrevMsg} 
                      sameSenderNextMsg={sameSenderNextMsg}
                    />
                  );
                }}
              />
            ) :
            (
              <ContactInvitation 
                contactName={contactName} 
                contactProfile={contactProfile} 
                onGreeting={onGreeting} 
              />
            )
        ) 
      }
      <InputToolbar 
        message={message} 
        onChangeText={onChangeText} 
        onSendMessage={onSendMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  spinnerContainer: {
    flex: 1,
    padding: 20
  }
});

export default Chat;
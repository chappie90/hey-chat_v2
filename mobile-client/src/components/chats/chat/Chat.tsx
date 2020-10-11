import React, { useState, useEffect, useContext, useRef  } from 'react';
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
  chatId: string;
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
  const { 
    state: { chatHistory }, 
    getMessages, 
    getMoreMessages,
    addMessage 
  } = useContext(ChatsContext);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const chatIdRef = useRef<string>(chatId);
  
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
    let isFirstMessage: boolean = false;

    // Create chat id if new chat
    if (!chatIdRef.current) {
      chatIdRef.current = uuid.v4();
      isFirstMessage = true;
    }
    
    const newMessage: TMessage  = {
      _id: uuid.v4(),
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
      chatId: chatIdRef.current,
      senderId: userId,
      recipientId: contactId,
      message: newMessage,
      isFirstMessage
    };

    setMessage('');
    addMessage(chatIdRef.current, newMessage);
    emitMessage(JSON.stringify(data), socketState);
  };

  const onEndReached = async (): Promise<void> => {
    if (!chatHistory[chatIdRef.current].allMessagesLoaded) {
      setIsLoading(true);

      const newPage = page + 1;
      const response = await getMoreMessages(username, contactProfile, chatIdRef.current, newPage);

      if (response) setIsLoading(false);
      if (!chatHistory[chatIdRef.current].allMessagesLoaded) {
        setPage(newPage);
      }
    }
  };

  useEffect(() => {
    (async () => {
      // Get messages if no previous chat history loaded
      if (!chatHistory[chatIdRef.current]) {
        setIsLoading(true);
        const response = await getMessages(username, contactProfile, chatIdRef.current);
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
          chatHistory[chatIdRef.current]?.messages.length > 0 ?
            (
              <FlatList
                keyExtractor={item => item._id.toString()}
                data={chatHistory[chatIdRef.current].messages}
                inverted
                onEndReached={onEndReached}
                onEndReachedThreshold={0.2}
                renderItem={({ item, index }) => {
                  const sameSenderPrevMsg = isSameSender(item, chatHistory[chatIdRef.current].messages[(index - 1)]);
                  const sameSenderNextMsg = isSameSender(item, chatHistory[chatIdRef.current].messages[(index + 1)]);
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
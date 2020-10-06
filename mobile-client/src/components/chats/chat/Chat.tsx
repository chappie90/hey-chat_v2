import React, { useState, useEffect, useContext  } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import uuid from 'react-native-uuid';

import { emitMessage } from '../../../socket/eventEmitters';
import { Context as AuthContext } from "../../../context/AuthContext";
import { TMessage } from './types';
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
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<TMessage[]>([]);

  const myMessages: TMessage[]  = [
    {
      _id: '1',
      text: 'Hello developer!!! dsada sd asd sad as as da sdssdss  sdsdsssss sa sdda s da d',
      createDate: new Date(),
      sender: {
        _id: 2,
        name: 'Designer',
        avatar: 'https://placeimg.com/140/140/any',
      },
      delivered: true,
      read: true
    },
    {
      _id: '2',
      text: 'Hello desig asd asd asd sa  as asdss sssss sss sss sss ss s sner! d  ssss ds!!',
      createDate: new Date(),
      sender: {
        _id: 1,
        name: 'Developer',
        avatar: 'https://facebook.github.io/react/img/logo_og.png',
      },
      delivered: true,
      read: true
    },
    {
      _id: '3',
      text: 'Hello again!!!',
      createDate: new Date(),
      sender: {
        _id: 1,
        name: 'Developer',
        avatar: 'https://facebook.github.io/react/img/logo_og.png',
      },
      delivered: true,
      read: true
    },
    {
      _id: '4',
      text: 'What\'s up?!!!',
      createDate: new Date(),
      sender: {
        _id: 2,
        name: 'Designer',
        avatar: 'https://placeimg.com/140/140/any',
      },
      delivered: true,
      read: false
    },
    {
      _id: '5',
      text: 'What\'s up?!!!',
      createDate: new Date(),
      sender: {
        _id: 2,
        name: 'Designer',
        avatar: 'https://placeimg.com/140/140/any',
      },
      delivered: true,
      read: false
    },
    {
      _id: '6',
      text: 'What\'s up?!!!',
      createDate: new Date(),
      sender: {
        _id: 2,
        name: 'Designer',
        avatar: 'https://placeimg.com/140/140/any',
      },
      delivered: false,
      read: false
    },
  ];
  
  const onGreeting = () => {
    onSendMessage('hi');
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

  const onSendMessage = (initialGreeting?: string): void => {
    const newMessage: TMessage  = {
      _id: uuid.v4(),
      text: initialGreeting ? initialGreeting : message,
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

    setMessages([ ...messages, newMessage ]);
    emitMessage(JSON.stringify(data), socketState);
  };

  useEffect(() => {
    // setMessages(myMessages);
  }, []);

  return (
    <View style={styles.container}>
      {messages.length > 0 ?
        (
          <FlatList
            keyExtractor={item => item._id.toString()}
            data={messages}
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
  }
});

export default Chat;
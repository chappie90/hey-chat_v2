import React, { useState, useEffect, useContext  } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  FlatList,
  TouchableNativeFeedback
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { TMessage } from './types';
import Message from './Message';
import InputToolbar from './InputToolbar';

const Chat = () => {
  const [message, setMessage] = useState('');

  const messages: any[]  = [
    {
      _id: 1,
      text: 'Hello developer!!! dsada sd asd sad as as da sdssdss  sdsdsssss sa sdda s da d',
      createDate: new Date(),
      sender: {
        _id: 2,
        name: 'Designer',
        avatar: 'https://placeimg.com/140/140/any',
      },
    },
    {
      _id: 2,
      text: 'Hello desig asd asd asd sa  as asdss sssss sss sss sss ss s sner! d  ssss ds!!',
      createDate: new Date(),
      sender: {
        _id: 1,
        name: 'Developer',
        avatar: 'https://facebook.github.io/react/img/logo_og.png',
      },
    },
    {
      _id: 3,
      text: 'Hello again!!!',
      createDate: new Date(),
      sender: {
        _id: 1,
        name: 'Developer',
        avatar: 'https://facebook.github.io/react/img/logo_og.png',
      },
    },
    {
      _id: 4,
      text: 'What\'s up?!!!',
      createDate: new Date(),
      sender: {
        _id: 2,
        name: 'Designer',
        avatar: 'https://placeimg.com/140/140/any',
      },
    },
    {
      _id: 5,
      text: 'What\'s up?!!!',
      createDate: new Date(),
      sender: {
        _id: 2,
        name: 'Designer',
        avatar: 'https://placeimg.com/140/140/any',
      },
    },
    {
      _id: 6,
      text: 'What\'s up?!!!',
      createDate: new Date(),
      sender: {
        _id: 2,
        name: 'Designer',
        avatar: 'https://placeimg.com/140/140/any',
      },
    },
  ];

  const isSameSender = (
    currentMsg: TMessage, 
    compareMsg: TMessage | undefined
  ): boolean | undefined => {
    return compareMsg && currentMsg.sender._id === compareMsg.sender._id;
  };

  const onChangeText = async (text: string): void => {
    setMessage(text);
  };

  return (
    <View style={styles.container}>
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
      <InputToolbar message={message} onChangeText={onChangeText} />
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
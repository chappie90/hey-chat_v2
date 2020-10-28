import React, { useState, useEffect, useContext, useRef  } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import uuid from 'react-native-uuid';

import { emitMessage } from '../../../socket/eventEmitters';
import { Context as AuthContext } from '../../../context/AuthContext';
import { Context as ChatsContext } from '../../../context/ChatsContext';
import Message from './Message';
import InputToolbar from './InputToolbar';
import MessageActions from './MessageActions';
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
  const [showMsgActions, setShowMsgActions] = useState(true);
  const [msgActionsCoord, setMsgActionsCoord] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const chatIdRef = useRef<string>(chatId);
  const flatListRef = useRef<any>(null);

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

  const onShowMessageActions = (index: number, coordinates: number[]): void => {
    setShowMsgActions(true);
    setMsgActionsCoord(coordinates);
  };

  const hideMessageActions = (): void => {
    setShowMsgActions(false);
    setMsgActionsCoord([0, 0]);
  };

  const scrollToEnd = (): void => {
    flatListRef.current.scrollToEnd({animated: true});
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
    <TouchableWithoutFeedback onPress={() => setShowMsgActions(false)}>
      <View style={styles.container}>
        {isLoading ? 
          (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color={Colors.yellowDark} />
            </View>
          ) :
          (
            chatHistory[chatIdRef.current]?.messages.length > 0 ?
              (
                <FlatList
                  ref={flatListRef}
                  inverted
                  initialNumToRender={20}
                  keyExtractor={item => item._id.toString()}
                  data={chatHistory[chatIdRef.current].messages}
                  renderItem={({ item, index }) => {
                    const sameSenderPrevMsg = isSameSender(item, chatHistory[chatIdRef.current].messages[(index + 1)]);
                    const sameSenderNextMsg = isSameSender(item, chatHistory[chatIdRef.current].messages[(index - 1)]);
                    const isLastMessage = index === 0;
                    return (
                      <Message 
                        index={index}
                        content={item} 
                        sameSenderPrevMsg={sameSenderPrevMsg} 
                        sameSenderNextMsg={sameSenderNextMsg}
                        isLastMessage={isLastMessage}
                        onShowMessageActions={onShowMessageActions}
                        hideMessageActions={hideMessageActions}
                      />
                    );
                  }}
                  onEndReached={onEndReached}
                  onEndReachedThreshold={0.2}
                  onContentSizeChange={() => scrollToEnd()}
                  onLayout={() => scrollToEnd()}
                  disableScrollViewPanResponder
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
        {showMsgActions &&
        <MessageActions 
          isVisible={showMsgActions} 
          coordinates={msgActionsCoord}
        />}
        <InputToolbar 
          message={message} 
          onChangeText={onChangeText} 
          onSendMessage={onSendMessage}
        />
      </View>
    </TouchableWithoutFeedback>
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
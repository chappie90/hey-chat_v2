import React, { useState, useEffect, useContext, useRef  } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import uuid from 'react-native-uuid';

import { emitNewMessage, emitLikeMessage, emitDeleteMessage } from '../../../socket/eventEmitters';
import { Context as AuthContext } from '../../../context/AuthContext';
import { Context as ChatsContext } from '../../../context/ChatsContext';
import Message from './Message';
import InputToolbar from './InputToolbar';
import MessageActions from './MessageActions';
import { Colors } from '../../../variables/variables';
import ContactInvitation from './ContactInvitation';
import ReplyBox from './ReplyBox';
import ScrollBottomButton from './ScrollBottomButton';

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
    addMessage,
    likeMessage,
    markMessageForDeletion,
    deleteMessage
  } = useContext(ChatsContext);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [showMsgActions, setShowMsgActions] = useState(true);
  const [msgActionsCoord, setMsgActionsCoord] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [activeMsg, setActiveMsg] = useState<TMessage | null>(null);
  const chatIdRef = useRef<string>(chatId);
  const flatListRef = useRef<any>(null);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

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
    scrollToEnd();
    
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
      liked: {
        likedByUser: false,
        likesCount: 0
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
    emitNewMessage(JSON.stringify(data), socketState);
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

  const onShowMessageActions = (message: TMessage, coordinates: number[]): void => {
    setShowMsgActions(true);
    setMsgActionsCoord(coordinates);
    setActiveMsg(message);
  };

  const hideMessageActions = (): void => {  
    setShowMsgActions(false);
  };

  const scrollToEnd = (): void => {
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  const onScroll = (offset: number): void => {
    if (offset > 300) {
      setShowScrollBottomBtn(true);
    } else {
      setShowScrollBottomBtn(false);
    }
  };

  const onLikeMessage = (): void => {
    likeMessage(chatIdRef.current, activeMsg?._id);
    
    const data = { 
      chatId: chatIdRef.current, 
      messageId: activeMsg?._id,
      recipientId: contactId
    };
    emitLikeMessage(JSON.stringify(data), socketState);

    hideMessageActions();
  };

  const onShowReplyBox = (): void => {
    setShowReplyBox(true);  
    hideMessageActions();
  };

  const onDeleteMessage = (): void => {
    hideMessageActions();
    markMessageForDeletion(chatIdRef.current, activeMsg?._id);

    const data = { 
      chatId: chatIdRef.current, 
      messageId: activeMsg?._id,
      recipientId: contactId
    };
    emitDeleteMessage(JSON.stringify(data), socketState);

    setTimeout(() => {
      deleteMessage(chatIdRef.current, activeMsg?._id);
    }, 350);
  };

  const onCloseReplyBox = (): void => {
    setShowReplyBox(false);
    setActiveMsg(null);
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
    <KeyboardAvoidingView 
      behavior={Platform.OS == "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 65 : 0}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={() => {
          setShowMsgActions(false);
          Keyboard.dismiss();
      }}>
        <View style={styles.container}>
          {isLoading &&
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color={Colors.yellowDark} />
            </View>
          }
          {chatHistory[chatIdRef.current]?.messages.length > 0 ?
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
                      onCloseReplyBox={onCloseReplyBox}
                    />
                  );
                }}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.2}
                // onContentSizeChange={() => scrollToEnd()}
                // onLayout={() => scrollToEnd()}
                onScroll={(e) => onScroll(e.nativeEvent.contentOffset.y)}
                disableScrollViewPanResponder
                keyboardDismissMode='on-drag'
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
          {showMsgActions &&
            <MessageActions 
              isVisible={showMsgActions} 
              coordinates={msgActionsCoord}
              likedByUser={activeMsg?.liked.likedByUser}
              onLikeMessage={onLikeMessage}
              onShowReplyBox={onShowReplyBox}
              onDeleteMessage={onDeleteMessage}
            />
          }
          {showReplyBox && activeMsg &&
            <ReplyBox originalMessage={activeMsg} onCloseReplyBox={onCloseReplyBox} />
          }
          {showScrollBottomBtn && <ScrollBottomButton scrollToEnd={scrollToEnd} />}
          <InputToolbar 
            message={message} 
            onChangeText={onChangeText} 
            onSendMessage={onSendMessage}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  spinnerContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center'
  }
});

export default Chat;
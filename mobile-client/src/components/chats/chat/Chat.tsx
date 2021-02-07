import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import uuid from 'react-native-uuid';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

import { 
  emitNewMessage, 
  emitLikeMessage, 
  emitDeleteMessage,
  emitStartTyping,
  emitStopTyping
} from 'socket/eventEmitters';
import Message from './Message';
import InputToolbar from './InputToolbar';
import MessageActions from './MessageActions';
import { Colors } from 'variables';
import ContactInvitation from './ContactInvitation';
import ReplyBox from './ReplyBox';
import ScrollBottomButton from './ScrollBottomButton';
import { chatsActions } from 'reduxStore/actions';
import api from 'api';
import Spinner from 'components/common/Spinner';

type ChatProps = {
  chatType: string;
  chatId: string;
  contactId?: number;
  contactName: string;
  contactProfile?: { small: string; medium: string };
  showCamera: () => void;
  hideCamera: () => void;
  showLibrary: () => void;
  hideLibrary: () => void;
  messageImageData: TCameraPhoto | null;
  clearMessageImageData: () => void;
};

const Chat = ({ 
  chatType, 
  chatId, 
  contactId, 
  contactName, 
  contactProfile,
  showCamera,
  hideCamera,
  showLibrary,
  hideLibrary,
  messageImageData,
  clearMessageImageData
}: ChatProps) => {
  const { socketState } = useSelector(state => state.app);
  const { user: { _id: userId, username } } = useSelector(state => state.auth);
  const { chatHistory, isFetchingMessages } = useSelector(state => state.chats);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [showMsgActions, setShowMsgActions] = useState(true);
  const [msgActionsCoord, setMsgActionsCoord] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [activeMsg, setActiveMsg] = useState<TMessage | null>(null);
  const chatIdRef = useRef<string>(chatId);
  const chatHistoryRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const dispatch = useDispatch();
  const stopTypingTimeoutRef = useRef<any>(null);
  const [showInputActions, setShowInputActions] = useState(false);

  const onGreeting = () => {
    onSendMessage('👋');
  };

  const isSameSender = (
    currentMsg: TMessage, 
    compareMsg: TMessage | undefined
  ): boolean | undefined => {
    return compareMsg && currentMsg.sender._id === compareMsg.sender._id;
  };

  const isSameDay = (
    currentMsg: TMessage,
    compareMsg: TMessage | undefined
  ): boolean | undefined => {
    return compareMsg && moment(currentMsg.createDate).isSame(moment(compareMsg.createDate), 'day');
  };

  const onChangeText = (text: string): void => {
    setMessage(text);

    onStartTyping(text);
  };

  const onStartTyping = (text: string) => {
    const data = { senderId: userId, recipientId: contactId };

    if (text) emitStartTyping(JSON.stringify(data), socketState);

    if (stopTypingTimeoutRef.current) clearTimeout(stopTypingTimeoutRef.current);

    stopTypingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(JSON.stringify(data), socketState); 
    }, 3000);
  };


  const onSendMessage = async (text: string, image?: string): Promise<void> => {
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
      image: image,
      liked: {
        likedByUser: false,
        likesCount: 0
      },
      delivered: false,
      read: false,
      reply: {
        origMsgId: activeMsg?._id,
        origMsgText: activeMsg?.text,
        origMsgSender: activeMsg?.sender.name
      }
    };

    const data = {
      chatType,
      chatId: chatIdRef.current,
      senderId: userId,
      recipientId: contactId,
      senderName: username,
      message: newMessage,
      isFirstMessage
    };

    setMessage('');
    dispatch(chatsActions.addMessage(chatIdRef.current, newMessage));

    // Upload message image to server
    if (messageImageData) {
      const imageName = await uploadMessageImage(newMessage._id, messageImageData);
      // Update message image source
      data.message.image = imageName;
      dispatch(chatsActions.updateMessageImageSrc(chatIdRef.current, data.message._id, imageName));
      clearMessageImageData();
    }

    emitNewMessage(JSON.stringify(data), socketState);

    if (showReplyBox) {
      setShowReplyBox(false);
      setActiveMsg(null);
    }  
  };

  const onEndReached = async (): Promise<void> => {
    if (!chatHistory[chatIdRef.current].allMessagesLoaded) {
      if (!isFetchingMessages) {
        dispatch(chatsActions.setIsFetchingMessages(true));

        const newPage = page + 1;
        dispatch(chatsActions.getMoreMessages(username, chatIdRef.current, newPage, contactProfile?.small ));

        if (!chatHistory[chatIdRef.current].allMessagesLoaded) {
          setPage(newPage);
        }
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
    if (activeMsg) dispatch(chatsActions.likeMessage(chatIdRef.current, activeMsg?._id));
    
    const data = { 
      chatId: chatIdRef.current, 
      messageId: activeMsg?._id,
      recipientId: contactId
    };
    emitLikeMessage(JSON.stringify(data), socketState);

    setShowMsgActions(false);
    setActiveMsg(null);
  };

  const onShowReplyBox = (): void => {
    setShowReplyBox(true);  
    setShowMsgActions(false);
  };

  const onDeleteMessage = (): void => {
    setShowMsgActions(false);
    setActiveMsg(null);

    if (activeMsg) dispatch(chatsActions.markMessageForDeletion(chatIdRef.current, activeMsg?._id));

    const data = { 
      chatId: chatIdRef.current, 
      messageId: activeMsg?._id,
      recipientId: contactId
    };
    emitDeleteMessage(JSON.stringify(data), socketState);

    setTimeout(() => {
      if (activeMsg) dispatch(chatsActions.deleteMessage(chatIdRef.current, activeMsg?._id));
    }, 350);
  };

  const onCloseReplyBox = (): void => {
    setShowReplyBox(false);
    setActiveMsg(null);
  };

  const hideInputToolbarActions = (): void => {
    setShowInputActions(false);
  };

  const toggleInputToolbarActions = (): void => {
    setShowInputActions(!showInputActions);
  };

  const uploadMessageImage = async (messageId: string, imageData: TCameraPhoto): Promise<string> => {
    let imageUri: string,
        imageName = '';

    if (imageData.filename) {
      imageUri = `${imageData.uri}/${imageData.filename}}`;
    } else {
      imageUri = imageData.uri;
    }

    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1].toLowerCase();

    let data = new FormData();
    data.append('messageImage',{
      uri: imageUri,
      name: chatId,
      type: `image/${fileType}`
    });

    await api.post('/message/image/upload', data, {
      onUploadProgress: progressEvent => {
        const totalLength = progressEvent.lengthComputable ? 
          progressEvent.total : 
          progressEvent.target.getResponseHeader('content-length') || 
          progressEvent.target.getResponseHeader('x-decompressed-content-length');

        if (totalLength !== null) {
          dispatch(chatsActions.messageImageIsUploading(
            chatIdRef.current,
            messageId,
            Math.round(((progressEvent.loaded * 100) / totalLength) * 0.85),
            false
          ));
        }  
      }
    })
    .then(response => {
      if (response.data) {  
        dispatch(chatsActions.messageImageIsUploading(chatIdRef.current, messageId, 100, true));
        imageName = response.data.imageName;
      }
    })
    .catch(error => {
      console.log('Upload message image method error');
      if (error.response) console.log(error.response.data.message);
      if (error.message) console.log(error.message);
    });

    return imageName;
  };

  useEffect(() => {
    (async () => {
      // Get messages if no previous chat history loaded
      if (!chatHistory[chatIdRef.current]) {
        dispatch(chatsActions.setIsFetchingMessages(true));
        dispatch(chatsActions.getMessages(username, chatIdRef.current, contactProfile?.small));
      }
    })();

    return () => {
      // Reset chat history to first 20 messages if more messages previously loaded
      if (chatHistoryRef.current[chatIdRef.current]?.messages.length > 20) {
        dispatch(chatsActions.resetMessages(chatIdRef.current));
      }
    };
  }, []);
  
  useEffect(() => {
    // Add new image as message to chat
    if (messageImageData) {
      setShowInputActions(false);
      onSendMessage('', messageImageData.uri);
    }
  }, [messageImageData]);

  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS == "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={() => {
          setShowMsgActions(false);
          Keyboard.dismiss();
      }}>
        <View style={styles.container}>
          {isFetchingMessages && <Spinner layout={styles.spinnerContainer} color={Colors.yellowDark} /> }
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
                  const shouldRenderDate = !isSameDay(item, chatHistory[chatIdRef.current].messages[(index + 1)]);
                  return (
                    <Message 
                      index={index}
                      content={item} 
                      contactName={contactName}
                      sameSenderPrevMsg={sameSenderPrevMsg} 
                      sameSenderNextMsg={sameSenderNextMsg}
                      isLastMessage={isLastMessage}
                      shouldRenderDate={shouldRenderDate}
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
            (!isLoading &&
              <ContactInvitation 
                contactName={contactName} 
                contactProfile={contactProfile?.medium} 
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
            showActions={showInputActions}
            toggleActions={toggleInputToolbarActions}
            showCamera={showCamera}
            showLibrary={showLibrary}
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
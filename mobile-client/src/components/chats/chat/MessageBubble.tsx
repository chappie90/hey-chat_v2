import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Image,
  TouchableWithoutFeedback, 
  useWindowDimensions,
  GestureResponderEvent, 
  Keyboard,
  Animated,
  Easing
} from 'react-native';
import config from 'react-native-config';
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image'
import Lightbox from 'react-native-lightbox';

import CustomText from 'components/CustomText';
import { Images } from 'assets';
import { Colors, Fonts, Headings } from 'variables';
import { chatsActions } from 'reduxStore/actions';

type MessageBubbleProps = {
  index: number;
  senderId: number;
  content: TMessage;
  contactName: string;
  sameSenderPrevMsg: boolean | undefined;
  sameSenderNextMsg: boolean | undefined;
  onShowMessageActions: (message: TMessage, coordinates: number[]) => void;
  hideMessageActions: () => void;
  onCloseReplyBox: () => void;
};

const MessageBubble = ({ 
  index,
  senderId,
  content,
  contactName,
  sameSenderPrevMsg,
  sameSenderNextMsg,
  onShowMessageActions,
  hideMessageActions,
  onCloseReplyBox
}: MessageBubbleProps) => {
  const { _id: messageId, text, reply, sender, image, admin } = content;
  const { 
    activeChat, 
    activeMessage, 
    msgImgUploadProgress, 
    msgImgUploadFinished 
  } = useSelector(state => state.chats);
  const windowWidth = useWindowDimensions().width;
  const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/chat/${activeChat?.chatId}`;
  const widthAnim = useRef(new Animated.Value(0));
  const dispatch = useDispatch();
  const [updateImage, setUpdateImage] = useState(false);
  const [activeMsgId, setActiveMsgId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messageTextColor, setMessageTextColor] = useState('');
  const [messageTextSize, setMessageTextSize] = useState(0);
  const [isLightbox, setIsLightBox] = useState(false);

  const onLongPress = (event: GestureResponderEvent, isAdmin?: boolean) => {
    if (isAdmin) return;

    onCloseReplyBox();
    const { pageY } = event.nativeEvent;
    const pageX = senderId === 1 ? windowWidth - 260 : 40;
    onShowMessageActions(content, [pageX, pageY > 180 ? pageY : 180]);
  };

  useEffect(() => {
    if (msgImgUploadFinished) {
      setUpdateImage(true);
      setActiveMsgId(activeMessage._id);

      Animated.timing(
        widthAnim.current, {
          duration: 2000,
          toValue: 1,
          easing: Easing.quad,
          useNativeDriver: false
        },
      ).start();

      setTimeout(function() {
        Animated.timing(
          widthAnim.current, {
            duration: 400,
            toValue: 0,
            easing: Easing.quad,
            useNativeDriver: false
          },
        ).start();
        setTimeout(() => {
          dispatch(chatsActions.messageImageIsUploading(activeChat?.chatId, activeMessage._id, 0, null));
        }, 1200);
      }, 2000);
    }
      
    if (msgImgUploadProgress > 0) {
      Animated.timing(
          widthAnim.current, {
            duration: 4000,
            toValue: msgImgUploadProgress,
            easing: Easing.quad,
            useNativeDriver: false
          },
        ).start();
    } 
  }, [msgImgUploadProgress, msgImgUploadFinished]);

  useEffect(() => {
    if (admin && text === 'Missed audio call') {
      if (senderId === 1) {
        setMessageText(`${contactName} missed your audio call`);
        setMessageTextColor(Colors.greyDark);
      } else {
        setMessageText('You have a missed audio call');
        setMessageTextColor(Colors.red);
      }
      setMessageTextSize(Headings.headingExtraSmall);
    } else if (admin && text === 'Missed video call') {
      if (senderId === 1) {
        setMessageText(`${contactName} missed your video call`);
        setMessageTextColor(Colors.greyDark);
      } else {
        setMessageText('You have a missed video call');
        setMessageTextColor(Colors.red);
      }
      setMessageTextSize(Headings.headingExtraSmall);
    } else {
      setMessageText(text);
      if (senderId === 1) {
        setMessageTextColor(Colors.white);
      } else {
        setMessageTextColor(Colors.greyDark);
      }
      setMessageTextSize(Headings.headingSmall);
    }
  }, [text, senderId]);

  useEffect(() => {
    console.log(isLightbox)
  }, [isLightbox])

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        hideMessageActions();
        Keyboard.dismiss();
      }} 
      onLongPress={(e) => onLongPress(e, admin)}
    >
      <View>
        {reply?.origMsgId &&
          <View style={[
            styles.replyBubble,
            senderId === 1 ? styles.rightReplyBubble : styles.leftReplyBubble,
          ]}>
            <View style={styles.imageContainer}>
              {sender.avatar ?
                <Image 
                  style={styles.image} 
                  source={{ uri: sender.avatar }}
                  /> : 
                <Image style={styles.image} source={ Images.avatarSmall } />
              }
            </View>
            <View style={styles.replyDetailsContainer}>
              <CustomText fontSize={Headings.headingSmall} fontWeight={Fonts.semiBold}>
                {reply?.origMsgSender}
              </CustomText>
              <CustomText fontSize={Headings.headingExtraSmall}>
                {reply?.origMsgText}
              </CustomText>
            </View>
          </View>
        }
        <View 
          style={[
            image ? styles.imageBubble : styles.bubble,
            senderId === 1 ? styles.rightBubble : styles.leftBubble,
            senderId === 1 && sameSenderPrevMsg && styles.rightBubblePrevMsg,
            senderId === 1 && sameSenderNextMsg && styles.rightBubbleNextMsg,
            senderId === 2 && sameSenderPrevMsg && styles.leftBubblePrevMsg,
            senderId === 2 && sameSenderNextMsg && styles.leftBubbleNextMsg,
            admin && styles.adminBubbleLast,
            admin && sameSenderNextMsg && styles.adminBubble,
            admin && senderId === 1 && styles.adminBubbleSender,
            admin && senderId === 2 && styles.adminBubbleRecipient
          ]}
        >
          {activeChat?.chatId && image ? 
            ( 
              <View style={[
                styles.messageImageContainer,
                senderId === 1 && sameSenderPrevMsg && styles.rightImagePrevMsg,
                senderId === 1 && sameSenderNextMsg && styles.rightImageNextMsg,
                senderId === 2 && sameSenderPrevMsg && styles.leftImagePrevMsg,
                senderId === 2 && sameSenderNextMsg && styles.leftImageNextMsg
              ]}>
                <Lightbox>
                  <FastImage
                    style={styles.image}
                    source={image.includes(activeChat.chatId) ? 
                      { uri: `${S3_BUCKET_PATH}/${image}` } :
                      { uri: image }
                    } 
                  />
                </Lightbox>
                {activeMessage && messageId === activeMessage._id &&
                  <Animated.View style={[
                    styles.progressIndicator,
                    { 
                      width: widthAnim.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }) 
                    }
                  ]} />
                }
              </View>
            ) :
            (
              <View style={styles.bubbleText}>
                {admin && text === 'Missed audio call' &&
                  <View style={styles.bubbleTextIcon}>
                    <FeatherIcon name='phone-missed' size={16} color={senderId === 1 ? Colors.greyDark : Colors.red} />
                  </View>
                }
                {admin && text === 'Missed video call' &&
                  <View style={styles.bubbleTextIcon}>
                    <MaterialIcon name='missed-video-call' size={20} color={senderId === 1 ? Colors.greyDark : Colors.red} />
                  </View>
                }
                <CustomText 
                  color={messageTextColor}
                  fontSize={messageTextSize}
                >
                  {messageText}
                </CustomText>
              </View>
            )
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 35
  },
  imageBubble: {
    borderRadius: 35,
    padding: 2
  },
  adminBubble: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginVertical: 8
  },
  adminBubbleLast: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  adminBubbleSender: {
    backgroundColor: Colors.greyLight
  },
  adminBubbleRecipient: {
    backgroundColor: Colors.redLight
  },
  leftBubble: {
    backgroundColor: Colors.yellowLight,
    alignSelf: 'flex-start'
  },
  leftBubblePrevMsg: {
    borderTopLeftRadius: 4
  },
  leftBubbleNextMsg: {
    borderBottomLeftRadius: 4
  },
  rightBubble: {
    backgroundColor: Colors.yellowDark,
    alignSelf: 'flex-end'
  },
  rightBubblePrevMsg: {
    borderTopRightRadius: 4
  },
  rightBubbleNextMsg: {
    borderBottomRightRadius: 4
  },
  replyBubble: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.yellowDark,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    flexDirection: 'row',
    bottom: -8
  },
  leftReplyBubble: {
    borderBottomRightRadius: 35,
    left: 8,
    alignSelf: 'flex-start'
  },
  rightReplyBubble: {
    borderBottomLeftRadius: 35,
    right: 8,
    alignSelf: 'flex-end'
  },
  bubbleText: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bubbleTextIcon: {
    marginRight: 6
  },
  imageContainer: {
    overflow: 'hidden', 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: Colors.greyLight,
    marginRight: 5
  },
  image: {
    width: '100%', 
    height: '100%'
  },
  replyDetailsContainer: {
    flexShrink: 1
  },
  messageImageContainer: {
    overflow: 'hidden',
    width: 200,
    height: 200,
    borderRadius: 35
  },
  leftImagePrevMsg: {
    borderTopLeftRadius: 4
  },
  leftImageNextMsg: {
    borderBottomLeftRadius: 4
  },
  rightImagePrevMsg: {
    borderTopRightRadius: 4
  },
  rightImageNextMsg: {
    borderBottomRightRadius: 4
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 6,
    backgroundColor: Colors.purpleDark
  }
});

export default MessageBubble;

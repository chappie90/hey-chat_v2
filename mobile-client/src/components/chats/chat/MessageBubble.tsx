import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Image,
  TouchableWithoutFeedback, 
  useWindowDimensions,
  GestureResponderEvent, 
  Keyboard
} from 'react-native';

import CustomText from 'components/CustomText';
import { Images } from 'assets';
import { Colors, Fonts, Headings } from 'variables';

type MessageBubbleProps = {
  index: number;
  userId: number;
  content: TMessage;
  sameSenderPrevMsg: boolean | undefined;
  sameSenderNextMsg: boolean | undefined;
  onShowMessageActions: (message: TMessage, coordinates: number[]) => void;
  hideMessageActions: () => void;
  onCloseReplyBox: () => void;
};

const MessageBubble = ({ 
  index,
  userId,
  content,
  sameSenderPrevMsg,
  sameSenderNextMsg,
  onShowMessageActions,
  hideMessageActions,
  onCloseReplyBox
}: MessageBubbleProps) => {
  const { text, reply, sender } = content;
  const windowWidth = useWindowDimensions().width;

  const onLongPress = (event: GestureResponderEvent) => {
    onCloseReplyBox();
    const { pageY } = event.nativeEvent;
    const pageX = userId === 1 ? windowWidth - 260 : 40;
    onShowMessageActions(content, [pageX, pageY > 180 ? pageY : 180]);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        hideMessageActions();
        Keyboard.dismiss();
      }} 
      onLongPress={(e) => onLongPress(e)}
    >
      <View>
        {reply?.origMsgId &&
          <View style={[
            styles.replyBubble,
            userId === 1 ? styles.rightReplyBubble : styles.leftReplyBubble,
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
            styles.bubble,
            userId === 1 ? styles.rightBubble : styles.leftBubble,
            userId === 1 && sameSenderPrevMsg && styles.rightBubblePrevMsg,
            userId === 1 && sameSenderNextMsg && styles.rightBubbleNextMsg,
            userId === 2 && sameSenderPrevMsg && styles.leftBubblePrevMsg,
            userId === 2 && sameSenderNextMsg && styles.leftBubbleNextMsg
          ]}
        >
          <CustomText 
            color={userId === 1 ? Colors.white : Colors.greyDark}
            fontSize={Headings.headingSmall}
          >
            {text}
          </CustomText>
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
  }
});

export default MessageBubble;

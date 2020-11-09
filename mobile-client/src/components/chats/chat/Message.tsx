import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import moment from 'moment';

import MessageBubble from './MessageBubble';
import MessageStatus from './MessageStatus';
import Avatar from './Avatar';
import LikeIcon from './LikeIcon';
import CustomText from '../../../components/CustomText';
import { Colors, Headings } from '../../../variables/variables';
import { formatDate } from '../../../helpers/formatDate';

type MessageProps = {
  index: number;
  content: TMessage;
  sameSenderPrevMsg: boolean | undefined;
  sameSenderNextMsg: boolean | undefined;
  isLastMessage: boolean;
  shouldRenderDate: boolean | undefined;
  onShowMessageActions: (message: TMessage, coordinates: number[]) => void;
  hideMessageActions: () => void;
  onCloseReplyBox: () => void;
};

const Message = ({ 
  index,
  content, 
  sameSenderPrevMsg, 
  sameSenderNextMsg,
  isLastMessage,
  shouldRenderDate,
  onShowMessageActions,
  hideMessageActions,
  onCloseReplyBox
}: MessageProps) => {
  const { sender, createDate, delivered, read, liked, deleted } = content;
  const deleteAnim = useRef(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(
      deleteAnim.current, { 
        toValue: deleted ? 0 : 1,
        duration: 350,
        useNativeDriver: true
      }
    ).start();
  }, [deleted]);

  return (
    <>
      {shouldRenderDate &&
        <CustomText style={styles.date} fontSize={Headings.headingSmall}>
          {moment(createDate).format('ll')}
        </CustomText>
      }
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Animated.View
          style={[
            styles.container,
            sender._id === 1 ? styles.rightMessage : styles.leftMessage,
            {
              marginTop: sameSenderPrevMsg ? 3 : 12,
              marginBottom: isLastMessage ? 12 : 0,
              transform: [ { scale: deleteAnim.current } ]
            }
          ]}
          onStartShouldSetResponder={() => true}
        >
          {sender._id === 2 && !sameSenderNextMsg && (
            <Avatar avatar={sender.avatar} />
          )}
          <View style={styles.messageContainer}>
            <LikeIcon sender={sender} liked={liked} />
            <MessageBubble 
              index={index}
              content={content} 
              userId={sender._id}
              sameSenderPrevMsg={sameSenderPrevMsg}
              sameSenderNextMsg={sameSenderNextMsg}
              onShowMessageActions={onShowMessageActions}
              hideMessageActions={hideMessageActions}
              onCloseReplyBox={onCloseReplyBox}
            />
            {!sameSenderNextMsg && 
              <View 
                style={[
                  styles.messageMeta,
                  { justifyContent: sender._id === 1 ? 'flex-end' : 'flex-start' }
                ]}
              >
                <CustomText 
                  style={styles.messageDate}
                  fontSize={11}
                  color={Colors.greyDark}
                >
                  {formatDate(createDate)}
                </CustomText>
                {sender._id === 1 && <MessageStatus delivered={delivered} read={read} />}
              </View>
            }
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  messageContainer: {},
  leftMessage: {
    paddingRight: 40,
    paddingLeft: 55
  },
  rightMessage: {
    paddingRight: 10,
    paddingLeft: 40,
    alignSelf: 'flex-end'
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  date: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20
  },
  messageDate: {}
});

export default Message;
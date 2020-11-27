import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Colors, Headings } from 'variables';
import CustomText from 'components/CustomText';

type MessageActionsProps = { 
  isVisible: boolean;
  coordinates: number[];
  likedByUser?: boolean;
  onLikeMessage: () => void;
  onShowReplyBox: () => void;
  onDeleteMessage: () => void;
};

const MessageActions = ({ 
  isVisible, 
  coordinates, 
  likedByUser,
  onShowReplyBox,
  onLikeMessage,
  onDeleteMessage
}: MessageActionsProps) => {
  const scaleAnim = useRef(new Animated.Value(0));

  useEffect(() => {
    scaleAnim.current.setValue(0);

    Animated.spring(
      scaleAnim.current, { 
        toValue: 1,
        useNativeDriver: true
      }
    ).start();
  }, [isVisible, coordinates]);
  
  return (
    <Animated.View
      style={[ 
        styles.container, 
        { 
          top: coordinates[1] - 160,
          left: coordinates[0],
          transform: [
            { scale: scaleAnim.current }
          ]
        }
      ]}
    >
      <View 
        style={[
          styles.triangle,
          { left: coordinates[0] === 40 ? 25 : 185 }
        ]} 
      />
      <View onStartShouldSetResponder={(e) => true} style={styles.innerContainer}>
        <TouchableOpacity onPress={() => onLikeMessage()} activeOpacity={0.5}>
          <View style={[styles.button, styles.likeBtn]}>
            <CustomText fontSize={Headings.headingExtraSmall} color={Colors.purpleDark}>
              {likedByUser ? 'Unlike' : 'Like'}
            </CustomText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onShowReplyBox()} activeOpacity={0.5}>
          <View style={[
              styles.button, 
              coordinates[0] !== 40 && styles.replyBtn
            ]}
          >
            <CustomText fontSize={Headings.headingExtraSmall} color={Colors.purpleDark}>
              Reply
            </CustomText>
          </View>
        </TouchableOpacity>
        {coordinates[0] !== 40 &&
          <TouchableOpacity onPress={() => onDeleteMessage()} activeOpacity={0.5}>
            <View style={styles.button}>
              <CustomText fontSize={Headings.headingExtraSmall} color={Colors.purpleDark}>
                Delete
              </CustomText>
            </View>
          </TouchableOpacity>
        }
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 35,
    backgroundColor: Colors.purpleLight,
    position: 'absolute',
    zIndex: 2,
    height: 45
  },
  triangle: {
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.purpleLight,
    position: 'absolute',
    bottom: -13,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    transform: [
      {rotate: '180deg'}
    ]
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '100%'
  },
  button: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: 75
  },
  likeBtn: {
    borderRightColor: Colors.purpleDark,
    borderRightWidth: 0.5
  },
  replyBtn: {
    borderRightColor: Colors.purpleDark,
    borderRightWidth: 0.5
  }
});

export default MessageActions;
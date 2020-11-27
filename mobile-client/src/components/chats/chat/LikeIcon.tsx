import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import { Colors, Headings } from 'variables';
import CustomText from 'components/CustomText';

type LikeIconProps = { sender: TSender, liked: TLike };

const LikeIcon = ({ sender, liked }: LikeIconProps) => {
  const likeAnim = useRef(new Animated.Value(1));

  useEffect(() => {
    Animated.spring(
      likeAnim.current, { 
        toValue: liked.likedByUser ? 1 : 0,
        useNativeDriver: true
      }
    ).start();
  }, [liked.likedByUser]);
  
  return (
    <>
      {liked.likesCount > 0 &&
        <Animated.View 
          style={[
            styles.likeIcon,
            sender._id === 1 && styles.userMsgLikeIcon,
            sender._id === 2 && styles.contactMsgLikeIcon,
            {
              width: liked.likesCount > 1 ? 'auto' : 32,
              height: liked.likesCount > 1 ? 'auto' : 32,
              padding: liked.likesCount === 1 ? 0 : 6,
              transform: [ { scale: likeAnim.current } ] 
            }
          ]}
        >
          <EntypoIcon name="thumbs-up" size={19} color={Colors.purpleDark} />
          {liked.likesCount > 1 &&
            <CustomText fontSize={Headings.headingExtraSmall}>
              {liked.likesCount}
            </CustomText>
          }
        </Animated.View>
      }
    </>
  );
};

const styles = StyleSheet.create({
  likeIcon: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
    borderRadius: 16,
    backgroundColor: Colors.purpleLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  userMsgLikeIcon: {
    left: -15
  },
  contactMsgLikeIcon: {
    right: -15
  }
});

export default LikeIcon;
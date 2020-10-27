import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Text } from 'react-native';

import { Colors } from '../../../variables/variables';

type MessageActionsProps = { 
  isVisible: boolean;
  bottomPos: number;
  leftPos: number;
};

const MessageActions = ({ isVisible, bottomPos, leftPos }: MessageActionsProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    Animated.spring(
      scaleAnim, { 
        toValue: isVisible ? 1 : 0,
        useNativeDriver: false
      }
    ).start();
    
    }, [isVisible, bottomPos, leftPos]);
  
  return (
    <Animated.View
      style={[ 
        styles.customModal, 
        { 
          top: bottomPos - 150,
          left: leftPos,
          transform: [
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <Text>Testing</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  customModal: {
    borderRadius: 35,
    backgroundColor: Colors.purpleLight,
    position: 'absolute',
    zIndex: 2,
    padding: 14,
    width: 200,
    height: 60
  }
});

export default MessageActions;
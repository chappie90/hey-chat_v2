import React, { useEffect, useRef, ReactNode } from 'react';
import { StyleSheet, Animated, useWindowDimensions } from 'react-native';

import { Colors } from '../variables/variables';

type CustomModalProps = { isVisible: boolean; children: ReactNode };

const CustomModal = ({ isVisible, children }: CustomModalProps) => {
  const window = useWindowDimensions();

  const topToBottomAnim = useRef(new Animated.Value(window.height - 70)).current;
  const rightToLeftAnim = useRef(new Animated.Value(window.width - 30)).current;
  const opactiyAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.timing(
     topToBottomAnim, { 
        toValue: isVisible ? 0 : window.height - 70,
        duration: 200,
        useNativeDriver: false
      }
    ).start();
 
    Animated.timing(
      rightToLeftAnim, { 
       toValue: isVisible ? 15 : window.width - 30,
       duration: 200,
       useNativeDriver: false
      }
    ).start();
 
    Animated.timing(
      opactiyAnim, { 
        toValue: isVisible ? 1 : 0,
        duration: 100,
        useNativeDriver: false
      }
      ).start();
    }, [isVisible]);
  
  return (
    <Animated.View
      style={[ 
        styles.customModal, 
        { 
          bottom: topToBottomAnim,
          left: rightToLeftAnim,
          opacity: opactiyAnim
        }
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  customModal: {
    borderRadius: 35,
    backgroundColor: Colors.purpleLight,
    position: 'absolute',
    right: 15,
    top: 80,
    zIndex: 2,
    padding: 14
  }
});

export default CustomModal;
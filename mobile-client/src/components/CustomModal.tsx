import React, { useEffect, useRef, ReactNode, CSSProperties } from 'react';
import { 
  StyleSheet, 
  Animated,
  useWindowDimensions
} from 'react-native';

import { Colors } from '../variables/variables';

type CustomModalProps = {
  style?: CSSProperties;
  children: ReactNode;
};

const CustomModal = ({ 
  style,
  children
}: CustomModalProps) => {
  const window = useWindowDimensions();

  const topToBottomAnim = useRef(new Animated.Value(window.height - 70)).current;
  const rightToLeftAnim = useRef(new Animated.Value(window.width - 30)).current;
  const opactiyAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.spring(
     topToBottomAnim, { 
        toValue: 0
        // duration: 800,
       //  easing: Easing.cubic
      }
    ).start();
 
    Animated.spring(
     rightToLeftAnim, { 
       toValue: 15
    //    duration: 800,
       // easing: Easing.cubic
     }
   ).start();
 
   Animated.timing(
     opactiyAnim, { 
        toValue: 1
        duration: 600,
       //  easing: Easing.cubic
      }
    ).start();
  }, []);
  
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
    zIndex: 2
  }
});

export default CustomModal;
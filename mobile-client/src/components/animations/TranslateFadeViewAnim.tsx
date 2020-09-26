import React, { useEffect, useRef, CSSProperties, ReactNode } from 'react';
import { Animated } from 'react-native';

type TranslateFadeViewAnimProps = {
  style?: CSSProperties;
  children: ReactNode;
};

const TranslateFadeViewAnim = ({ style, children }: TranslateFadeViewAnimProps) => {
  const translateAnim = useRef(new Animated.Value(150)).current;
  const fadeAnim = useRef(new Animated.Value(0.01)).current;

   useEffect(() => {
    Animated.timing(
      translateAnim,
      {
        toValue: 0.01,
        duration: 600,
        delay: 100,
        useNativeDriver: true
      }
    ).start();
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1500,
        delay: 400,
        useNativeDriver: true
      }
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...style,
        transform: [
          { translateY: translateAnim }
        ],
        opacity: fadeAnim
      }}
    >
      {children}
    </Animated.View>
  );
};

export default TranslateFadeViewAnim;
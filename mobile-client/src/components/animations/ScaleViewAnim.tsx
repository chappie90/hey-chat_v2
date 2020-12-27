import React, { useEffect, useRef, CSSProperties, ReactNode } from 'react';
import { Animated } from 'react-native';

type ScaleViewAnimProps = {
  style?: CSSProperties;
  children: ReactNode;
};

const ScaleViewAnim = ({ style, children }: ScaleViewAnimProps) => {
  const scaleAnim = useRef(new Animated.Value(0.01)).current;

   useEffect(() => {
    Animated.spring(
      scaleAnim, { 
        toValue: 1, 
        delay: 400,
        useNativeDriver: true 
      }
    ).start();
  }, []);

  return (
    <Animated.View style={{ ...style, transform: [ { scale: scaleAnim } ] }}>
      {children}
    </Animated.View>
  );
};

export default ScaleViewAnim;
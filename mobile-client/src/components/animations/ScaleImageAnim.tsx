import React, { useEffect, useRef, CSSProperties } from 'react';
import { Animated, ImageSourcePropType } from 'react-native';

type ScaleImageAnimProps = {
  source: ImageSourcePropType;
  style?: CSSProperties;
};

const ScaleImageAnim = ({ source, style }: ScaleImageAnimProps) => {
  const scaleAnim = useRef(new Animated.Value(0.01)).current;

  useEffect(() => {
    Animated.spring(
      scaleAnim, {
        delay: 100,
        toValue: 1,
        useNativeDriver: true
      },
    ).start();
  }, []);

  return (
    <Animated.Image
      source={source}
      style={{ ...style, transform: [ { scale: scaleAnim } ] }}
    />
  );
};

export default ScaleImageAnim;
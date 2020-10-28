import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';

import { Colors, Headings } from '../../../variables/variables';
import CustomText from '../../CustomText';

type MessageActionsProps = { 
  isVisible: boolean;
  coordinates: number[];
};

const MessageActions = ({ isVisible, coordinates }: MessageActionsProps) => {
  const scaleAnim = useRef(new Animated.Value(0));

  useEffect(() => {
    scaleAnim.current.setValue(0);

    Animated.spring(
      scaleAnim.current, { 
        toValue: 1,
        useNativeDriver: false
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
      <View style={styles.innerContainer}>
        <CustomText fontSize={Headings.headingExtraSmall} color={Colors.purpleDark}>Like</CustomText>
        <View style={styles.divider} />
        <CustomText fontSize={Headings.headingExtraSmall} color={Colors.purpleDark}>Reply</CustomText>
        <View style={styles.divider} />
        <CustomText fontSize={Headings.headingExtraSmall} color={Colors.purpleDark}>Delete</CustomText>
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
    width: 220,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    height: '100%'
  },
  divider: {
    backgroundColor: Colors.purpleDark,
    width: 0.5,
    height: '100%'
  }
});

export default MessageActions;
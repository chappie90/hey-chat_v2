import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons'

import { Colors } from '../../../variables/variables';

type ScrollBottomButtonProps = { scrollToEnd: () => void; };

const ScrollBottomButton = ({ scrollToEnd }: ScrollBottomButtonProps) => {

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => scrollToEnd()}>
      <View style={styles.button}>
        <Ionicon 
          color={Colors.yellowDark} 
          name="arrow-down" 
          size={34} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 10,
    bottom: 80,
    zIndex: 3 ,
    width: 42,
    height: 41,
    paddingLeft: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.yellowLight
  }
});

export default ScrollBottomButton;

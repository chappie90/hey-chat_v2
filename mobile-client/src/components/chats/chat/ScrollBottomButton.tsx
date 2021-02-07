import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons'

import { Colors } from 'variables';

type ScrollBottomButtonProps = { scrollToEnd: () => void; };

const ScrollBottomButton = ({ scrollToEnd }: ScrollBottomButtonProps) => {

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() => scrollToEnd()}>
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
  container: {
    position: 'absolute',
    right: 10,
    bottom: 120,
    zIndex: 3,
    elevation: 3,
  },
  button: {
    width: 41,
    height: 41,
    paddingLeft: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.yellowLight
  }
});

export default ScrollBottomButton;

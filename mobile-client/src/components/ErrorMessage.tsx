import React, { Fragment, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet
} from 'react-native';
import { Animated } from 'react-native';

import { Colors, Fonts, Headings } from 'variables';
import CustomText from './CustomText';
import CustomButton from './CustomButton';

type ErrorMessageProps = {
  visible: boolean;
  heading: string;
  message: string;
  buttonText: string;
  onClearMessage: () => void;
};

const ErrorMessage = ({ visible, heading, message, buttonText, onClearMessage }: ErrorMessageProps) => {
  const translateAnim = useRef(new Animated.Value(350)).current;
  const fadeAnim = useRef(new Animated.Value(0.01)).current;

  useEffect(() => {
    Animated.spring(
      translateAnim,
      {
        toValue: 0.01,
        useNativeDriver: true
      }
    ).start();
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }
    ).start();
  }, [visible]);

  if (!visible) return <Fragment></Fragment>

  return (
    <View style={styles.modal}>
      <Animated.View
        style={{
          ...styles.container,
          transform: [
            { translateY: translateAnim }
          ],
          opacity: fadeAnim
        }}
      >
        <CustomText  style={{ marginBottom: 10 }}>{heading}</CustomText>
        <CustomText 
          style={styles.message} 
          color={Colors.red} 
          fontSize={Headings.headingSmall}
        >
          {message}
        </CustomText>
        <CustomButton 
          style={styles.button}
          color={Colors.lightGrey} 
          colorText={Colors.darkGrey}
          textFontSize={Headings.headingExtraSmall}
          textFontWeight={Fonts.regular} 
          onPress={onClearMessage}>
          {buttonText}
        </CustomButton>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: 0,
    left: 20,
    bottom: 0,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: Colors.white,
    padding: 25,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginBottom: 20, 
    textAlign: 'center' 
  },
  button: {
    alignSelf: 'center'
  }
});

export default ErrorMessage;
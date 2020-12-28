import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from "react-native-modal";

import { authActions } from 'reduxStore/actions';
import AuthForm from 'components/authentication/AuthForm';
import { Colors } from 'variables';

type SigninScreenProps = {
  visible: boolean;
  toggleModals: () => void;
  closeModal: () => void;
};

const SigninScreen = ({ visible, toggleModals, closeModal }: SigninScreenProps) => {
  const [opacity, setOpacity] = useState(1);

  const dismissKeyboard = (): void => {
    Keyboard.dismiss();
  };

  const toggleOpacityArrow = (isInputFocused: boolean): void => {
    setOpacity(isInputFocused ? 0.25 : 1);
  };

  const onModalClose = (): void => {
    closeModal();
    toggleOpacityArrow(false);
  };

  return (
    <Modal 
      isVisible={visible} 
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={onModalClose}
      swipeThreshold={60}
      swipeDirection="down"
      coverScreen={false}
      backdropOpacity={0}
      onBackdropPress={dismissKeyboard}
      // propagateSwipe={true}
      style={styles.modal}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={[ styles.arrowIcon, { opacity } ]}>
            <MaterialIcon name="keyboard-arrow-down" size={85} color={Colors.yellowDark} />
          </View>
          <AuthForm
            heading="Welcome back"
            buttonText="Sign In"
            toggleModalPrompt="Don't have an account yet?"
            toggleModalLink="Sign up here"
            onSubmitCallback={authActions.signin}
            toggleModals={toggleModals}
            toggleOpacityArrow={toggleOpacityArrow}
          />
          {Platform.OS === 'ios' && <KeyboardAvoidingView behavior="padding" />}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 0, 
    marginBottom: 0
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginTop: '25%',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: 'hidden'
  },
  arrowIcon: {
    position: 'absolute',
    top: -10,
    margin: 'auto'
  }
});

export default SigninScreen;
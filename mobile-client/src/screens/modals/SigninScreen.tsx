import React, { useContext } from 'react';
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
import { useSelector } from 'react-redux';

import actions from 'redux/actions';
import AuthForm from 'components/authentication/AuthForm';
import { Colors } from 'variables';

type SigninScreenProps = {
  visible: boolean;
  toggleModals: () => void;
  closeModal: () => void;
};

const SigninScreen = ({ visible, toggleModals, closeModal }: SigninScreenProps) => {
  const { signin } = useSelector(state => state.auth);

  const dismissKeyboard = (): void => {
    Keyboard.dismiss();
  };

  return (
    <Modal 
      isVisible={visible} 
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={() => closeModal()}
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
          <View style={styles.arrowIcon}>
            <MaterialIcon name="keyboard-arrow-down" size={85} color={Colors.yellowDark} />
          </View>
          <AuthForm
            heading="Welcome back"
            buttonText="Sign In"
            toggleModalPrompt="Don't have an account yet?"
            toggleModalLink="Sign up here"
            onSubmitCallback={actions.authActions.signin}
            toggleModals={toggleModals}
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
    marginTop: '35%',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35
  },
  arrowIcon: {
    position: 'absolute',
    top: 10,
    margin: 'auto'
  }
});

export default SigninScreen;
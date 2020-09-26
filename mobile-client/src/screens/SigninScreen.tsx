import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from "react-native-modal";

import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import { Colors } from '../variables/variables';

type SigninScreenProps = {
  visible: boolean;
  toggleModals: () => void;
  closeModal: () => void;
};

const SigninScreen = ({ visible, toggleModals, closeModal }: SigninScreenProps) => {
  const { signin } = useContext(AuthContext);

  const dismissKeyboard = (): void => {
    Keyboard.dismiss();
  };

  return (
    <Modal 
      isVisible={visible} 
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={closeModal}
      swipeThreshold={60}
      swipeDirection="down"
      coverScreen={false}
      backdropOpacity={0}
      onBackdropPress={dismissKeyboard}
      propagateSwipe={true}
      style={styles.modal}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeModalButton} onPress={closeModal}>
            <MaterialIcon name="close" size={35} color={Colors.tertiary} />
          </TouchableOpacity>
          <AuthForm
            heading="Welcome back"
            buttonText="Sign In"
            toggleModalPrompt="Don't have an account yet?"
            toggleModalLink="Sign up here"
            onSubmitCallback={signin}
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
    marginTop: '15%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  closeModalButton: {
    position: 'absolute',
    top: 30,
    right: 15
  }
});

export default SigninScreen;
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import Modal from "react-native-modal";

import { Colors, Headings } from '../variables/variables';
import { Context as AuthContext } from "../context/AuthContext";
// import { Context as ContactsContext } from "../context/ContactsContext";

type AddContactScreenProps = {
  visible: boolean;
  closeModal: () => void;
};

const AddContactScreen = ({ visible, closeModal }: AddContactScreenProps) => {

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
      backdropOpacity={0}
      onBackdropPress={dismissKeyboard}
      propagateSwipe={true}
      style={{ margin: 0}}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <Text>Add Contact Modal</Text>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default AddContactScreen;
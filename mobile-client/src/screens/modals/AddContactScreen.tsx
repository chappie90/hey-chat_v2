import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  TextInput
} from 'react-native';
import Modal from "react-native-modal";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Colors, Headings } from '../../variables/variables';
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as ContactsContext } from "../../context/ContactsContext";

type AddContactScreenProps = {
  visible: boolean;
  closeModal: () => void;
};

const AddContactScreen = ({ visible, closeModal }: AddContactScreenProps) => {
  const { searchContacts } = useContext(ContactsContext);
  const { state: { username } } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dismissKeyboard = (): void => {
    Keyboard.dismiss();
  };

  const onChangeText = (text: string): void => {
    setSearch(text);
    if (!text) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    const response = searchContacts(username, text);
    setIsLoading(false);
  };

  const onPressCloseBtn = (): void => {
    closeModal();
    setSearch('');
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
      style={styles.modal}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialIcon name="search" size={40} color={Colors.white} />
            <TextInput
              style={styles.input} 
              selectionColor={'grey'}
              placeholder="Find people..."
              placeholderTextColor="white"
              autoFocus
              value={search}
              onChangeText={onChangeText}
              autoCapitalize="none"
              autoCorrect={false} />
            <TouchableOpacity onPress={onPressCloseBtn}>
              <MaterialIcon name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
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
  header: {
    paddingHorizontal: 10,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary
  },
  input: {
    fontSize: 24,
    height: '100%',
    flex: 1,
    color: 'white',
    paddingLeft: 10
  }
});

export default AddContactScreen;
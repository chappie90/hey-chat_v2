import React, { useState, useContext } from 'react';
import { 
  View, 
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';

import { Context as AuthContext } from "../../context/AuthContext";
import { Context as ContactsContext } from "../../context/ContactsContext";
import SearchForm from '../../components/contacts/addContact/SearchForm';
import SearchList from '../../components/contacts/addContact/SearchList';

type AddContactScreenProps = {
  visible: boolean;
  closeModal: () => void;
};

type Contact = {
  _id: number;
  username: string;
};

const AddContactScreen = ({ visible, closeModal }: AddContactScreenProps) => {
  const { searchContacts, addContact } = useContext(ContactsContext);
  const { state: { userId, username } } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const dismissKeyboard = (): void => {
    Keyboard.dismiss();
  };

  const onChangeText = async (text: string): Promise<void> => {
    setIsLoading(true);
    setSearch(text);

    if (!text) {
      setIsLoading(false);
      setSearchResults([]);
      return;
    } 

    const response: Contact[] = await searchContacts(username, text);

    setSearchResults([ ...response ]);
    setIsLoading(false);
  };

  const onAddContact = async (contactId: number): Promise<void> => {
    setIsLoading(true);

    await addContact(userId, contactId);

    setIsLoading(false);
    setSearch('');
    closeModal();
    navigation.navigate('CurrentChat');
  };

  const onCloseModal = (): void => {
    closeModal();
    setSearch('');
    setSearchResults([]);
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
          <SearchForm search={search} onChangeText={onChangeText} onCloseModal={onCloseModal} />
          <SearchList searchResults={searchResults} onAddContact={onAddContact} />
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
    marginTop: '25%'
  }
});

export default AddContactScreen;
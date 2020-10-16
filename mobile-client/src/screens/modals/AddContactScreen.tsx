import React, { useState, useContext } from 'react';
import { 
  View, 
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';

import { Context as AuthContext } from "../../context/AuthContext";
import { Context as ContactsContext } from "../../context/ContactsContext";
import SearchForm from '../../components/contacts/addContact/SearchForm';
import SearchList from '../../components/contacts/addContact/SearchList';
import SearchIcon from '../../components/contacts/addContact/SearchIcon';
import CustomText from '../../components/CustomText';
import { Colors } from '../../variables/variables';

type AddContactScreenProps = {
  visible: boolean;
  closeModal: () => void;
};

const AddContactScreen = ({ visible, closeModal }: AddContactScreenProps) => {
  const { searchContacts } = useContext(ContactsContext);
  const { state: { userId, username } } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<TContact[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const dismissKeyboard = (): void => {
    Keyboard.dismiss();
  };

  const onChangeText = async (text: string): Promise<void> => {
    setIsLoading(true);
    setSearch(text);
    setIsFirstRender(false);

    if (!text) {
      setIsLoading(false);
      setSearchResults([]);
      return;
    } 

    const response: TContact[] = await searchContacts(username, text);

    setSearchResults([ ...response ]);
    setIsLoading(false);
  };

  const onSendMessage = (contact: TContact): void => {
    setIsFirstRender(true);
    setSearch('');
    setSearchResults([]);
    closeModal();

    navigation.navigate('CurrentChat', {
      chatType: 'private',
      chatId: undefined,
      contactId: contact._id, 
      contactName: contact.username,
    });
  };

  const onCloseModal = (): void => {
    closeModal();
    setIsFirstRender(true);
    setSearch('');
    setSearchResults([]);
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      onSwipeComplete={closeModal}
      swipeThreshold={60}
      swipeDirection="down"
      backdropOpacity={0}
      onBackdropPress={dismissKeyboard}
      propagateSwipe={true}
      coverScreen={false}
      style={styles.modal}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <SearchForm search={search} onChangeText={onChangeText} onCloseModal={onCloseModal} />
          {isLoading ? 
            (
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color={Colors.yellowDark} />
              </View> 
            ) :
            ( 
              searchResults.length > 0 ? 
                <SearchList searchResults={searchResults} onSendMessage={onSendMessage} /> :
                search ?
                  <CustomText style={styles.noResults}>No users found</CustomText> :
                  <SearchIcon isFirstRender={isFirstRender} />
            )
          }
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 14, 
    backgroundColor: Colors.purpleLight,
    padding: 14,
    marginTop: 80,
    borderRadius: 35
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinnerContainer: {
    flex: 1,
    padding: 5
  },
  noResults: {
    flex: 1,
    marginTop: 20
  }
});

export default AddContactScreen;
import React, { useState, useContext } from 'react';
import { 
  View, 
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Context as AuthContext } from "../../context/AuthContext";
import { Context as ContactsContext } from "../../context/ContactsContext";
import SearchForm from '../../components/contacts/addContact/SearchForm';
import SearchList from '../../components/contacts/addContact/SearchList';
import SearchIcon from '../../components/contacts/addContact/SearchIcon';
import CustomText from '../../components/CustomText';
import CustomModal from '../../components/CustomModal';
import { Colors, Fonts, Headings } from '../../variables/variables';

type AddContactScreenProps = { visible: boolean };

const AddContactScreen = ({ visible }: AddContactScreenProps) => {
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

    navigation.navigate('CurrentChat', {
      chatType: 'private',
      chatId: undefined,
      contactId: contact._id, 
      contactName: contact.username,
    });
  };

  const onCloseModal = (): void => {
    setIsFirstRender(true);
    setSearch('');
    setSearchResults([]);
  };

  return (
    <CustomModal
      isVisible={visible}
      // onBackdropPress={dismissKeyboard}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.triangle} />
          <CustomText 
            style={styles.subHeading}
            color={Colors.purpleDark}
            fontWeight={Fonts.semiBold}
            fontSize={Headings.headingBig}
          >
            Search
          </CustomText>
          <View style={styles.searchContainer}>
            {isLoading ? 
              (
                <View style={styles.spinnerContainer}>
                  <ActivityIndicator size="large" color={Colors.yellowDark} />
                </View> 
              ) :
              ( 
                <>
                  <SearchForm search={search} onChangeText={onChangeText} onCloseModal={onCloseModal} />
                  {searchResults.length > 0 ? 
                    <SearchList searchResults={searchResults} onSendMessage={onSendMessage} /> :
                    search ?
                      <CustomText
                        fontSize={Headings.headingSmall}
                        style={styles.noResults}
                      >
                          No users found
                      </CustomText> :
                      <SearchIcon isFirstRender={isFirstRender} />
                  }
                </>
              )
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.purpleLight,
    position: 'absolute',
    right: 0,
    top: -40,
    transform: [
       { rotate: '25deg' }
    ]
  },
  subHeading: {
    marginLeft: 15,
    marginBottom: 10
  },
  searchContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 35,
    paddingVertical: 10
  },
  spinnerContainer: {
    flex: 1,
    padding: 5
  },
  noResults: {
    flex: 1,
    marginTop: 10,
    marginLeft: 20
  }
});

export default AddContactScreen;
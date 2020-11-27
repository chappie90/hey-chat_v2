import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

import { Context as AuthContext } from 'context/AuthContext';
import { Context as ContactsContext } from 'context/ContactsContext';
import AddContactScreen from './modals/AddContactScreen';
import { Colors } from 'variables';
import ContactsHeader from 'components/contacts/contactsList/ContactsHeader';
import ToggleListTabs from 'components/contacts/contactsList/toggleListTabs';
import AllContacts from 'components/contacts/contactsList/AllContacts';
import ActiveContacts from 'components/contacts/contactsList/ActiveContacts';
import ContactsIcon from 'components/contacts/contactsList/ContactsIcon';

type ContactsScreenRouteProp = RouteProp<MainStackParams, 'Contacts'>;
type ContactsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainStackParams, 'Contacts'>,
  StackNavigationProp<ContactsStackParams>
>;

type ContactsScreenProps = {
  route: ContactsScreenRouteProp;
  navigation: ContactsScreenNavigationProp;
};

const ContactsScreen = ({ route, navigation }: ContactsScreenProps) => {
  const { state: { userId } } = useContext(AuthContext);
  const { state: { contacts }, getContacts } = useContext(ContactsContext);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleModal = (): void => {
    setShowAddContact(!showAddContact);
  };

  const closeModal = (): void => {
    setShowAddContact(false);
  };

  const toggleList = (value: boolean): void => {
    setShowActiveUsers(value);
  };

  const onContactSelect = (contact: TContact): void => {
    console.log(contact)

    navigation.navigate('CurrentChat', {
      chatType: 'private',
      chatId: contact.chatId,
      contactId: contact._id,
      contactName: contact.username
    });
  };

  useEffect(() => {
    (async () => {
      const response = await getContacts(userId);
      if (response) setIsLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <AddContactScreen visible={showAddContact} />
      <ContactsHeader toggleModal={toggleModal} />
      {isLoading ? 
        (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={Colors.yellowDark} />
          </View>
        ) :
        (
          contacts.length > 0 ? 
            (
              <>
                <ToggleListTabs 
                  allUsersCount={contacts.length}
                  activeUsersCount={contacts.length}
                  showActiveUsers={showActiveUsers} 
                  toggleList={toggleList} 
                />
                {showActiveUsers ?
                  <ActiveContacts 
                    contacts={contacts} 
                    activeUsersCount={contacts.length} 
                    onContactSelect={onContactSelect}
                  /> :
                  <AllContacts contacts={contacts} onContactSelect={onContactSelect} />
                }
              </>
            ) :
            (
              <ContactsIcon />
            )
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  spinnerContainer: {
    padding: 20
  }
});

export default ContactsScreen;
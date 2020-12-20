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
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';

import AddContactScreen from './modals/AddContactScreen';
import { Colors } from 'variables';
import ContactsHeader from 'components/contacts/contactsList/ContactsHeader';
import ToggleListTabs from 'components/contacts/contactsList/toggleListTabs';
import AllContacts from 'components/contacts/contactsList/AllContacts';
import ActiveContacts from 'components/contacts/contactsList/ActiveContacts';
import ContactsIcon from 'components/contacts/contactsList/ContactsIcon';
import { Animations } from 'assets';

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
  const { userId } = useSelector(state => state.auth);
  const { contacts, onlineContacts, contactsFetched } = useSelector(state => state.contacts);
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
    navigation.navigate('CurrentChat', {
      chatType: 'private',
      chatId: contact.chatId,
      contactId: contact._id,
      contactName: contact.username
    });
  };

  useEffect(() => {
    if (contactsFetched) setIsLoading(false);
  }, [contactsFetched]);

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
                  activeUsersCount={onlineContacts.length}
                  showActiveUsers={showActiveUsers} 
                  toggleList={toggleList} 
                />
                {showActiveUsers ?
                  <ActiveContacts 
                    contacts={onlineContacts} 
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
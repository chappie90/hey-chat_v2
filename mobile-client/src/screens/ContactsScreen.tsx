import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

import { MainStackParams, ContactsStackParams } from '../navigation/types';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as ContactsContext } from '../context/ContactsContext';
import AddContactScreen from './modals/AddContactScreen';
import { Colors, Headings } from '../variables/variables';
import CustomText from '../components/CustomText';
import ContactsHeader from '../components/contacts/contactsList/ContactsHeader';
import ToggleListTabs from '../components/contacts/contactsList/toggleListTabs';

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

  const openModal = (): void => {
    setShowAddContact(true);
  };

  const closeModal = (): void => {
    setShowAddContact(false);
  };

  const toggleList = (value: boolean): void => {
    setShowActiveUsers(value);
  };

  useEffect(() => {
    async () => {
      const response = await getContacts(userId);
      if (response) setIsLoading(false);
    };
  }, []);

  return (
    <View styles={styles.container}>
      <AddContactScreen visible={showAddContact} closeModal={closeModal} />
      <ContactsHeader openModal={openModal} />
      <ToggleListTabs 
        allUsersCount={contacts.length}
        activeUsersCount={contacts.length}
        showActiveUsers={showActiveUsers} 
        toggleList={toggleList} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ContactsScreen;
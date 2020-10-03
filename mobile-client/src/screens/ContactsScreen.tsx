import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { RouteProp } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

import { MainStackParams, ContactsStackParams } from '../navigation/types';
import AddContactScreen from './modals/AddContactScreen';
import { Colors, Headings } from '../variables/variables';
import CustomText from '../components/CustomText';

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
  const [showNewContact, setShowNewContact] = useState(false);

  const closeModal = (): void => {
    setShowNewContact(false);
  };

  return (
    <View styles={styles.container}>
      <AddContactScreen visible={showNewContact} closeModal={closeModal} />
      <View style={styles.headerContainer}>
        <CustomText color={Colors.white} fontSize={Headings.headingLarge}>My Contacts</CustomText>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowNewContact(true)}>
          <FontAwesome5 name="user-plus" size={Headings.headingBig} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingRight: 15,
    paddingLeft: 20,
    paddingTop: 65,
    paddingBottom: 10,
    height: 110
  },
  addButton: {
    marginTop: 10
  }
});

export default ContactsScreen;
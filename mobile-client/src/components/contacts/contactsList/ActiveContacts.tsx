import React from 'react';
import { 
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';

import { Colors, Headings } from '../../../variables/variables';

type Contact = {
  _id: number;
  username: string;
};

type ActiveContactsProps = {
  searchResults: Contact[];
  onAddContact: (contactId: number) => void;
};

const ActiveContacts = ({  }: ActiveContactsProps) => {
  return (
    <ScrollView style={styles.scrollContainer}>

    </ScrollView>
  );
};

const styles = StyleSheet.create({

});

export default ActiveContacts;


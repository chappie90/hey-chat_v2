import React from 'react';
import { 
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';

import { Colors, Headings } from '../../../variables/variables';
import SearchItem from './SearchItem';

type Contact = {
  _id: number;
  username: string;
};

type AllContactsProps = {

};

const AllContacts = ({  }: AllContactsProps) => {
  return (
    <ScrollView style={styles.scrollContainer}>

    </ScrollView>
  );
};

const styles = StyleSheet.create({

});

export default AllContacts;


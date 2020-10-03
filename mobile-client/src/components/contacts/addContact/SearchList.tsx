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

type SearchListProps = {
  searchResults: Contact[];
  onAddContact: (contactId: number) => void;
};

const SearchList = ({ searchResults, onAddContact }: SearchListProps) => {
  return (
    <ScrollView style={styles.scrollContainer}>
      {searchResults.map((item, index) => (
        <TouchableWithoutFeedback
          key={item.username}
          style={{ marginTop: 10, borderRadius: 5, overflow: 'hidden', flex: 1 }} 
          onPress={() => {}}>
          <SearchItem item={item} onAddContact={onAddContact} />
        </TouchableWithoutFeedback>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%'
  }
});

export default SearchList;


import React from 'react';
import { 
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';

import { Contact } from './types';
import SearchItem from './SearchItem';

type SearchListProps = {
  searchResults: Contact[];
  onSendMessage: (contact: Contact) => void;
};

const SearchList = ({ searchResults, onSendMessage }: SearchListProps) => {
  return (
    <ScrollView style={styles.scrollContainer}>
      {searchResults.map((item, index) => (
        <TouchableWithoutFeedback
          key={item.username}
          style={{ marginTop: 10, borderRadius: 5, overflow: 'hidden', flex: 1 }} 
          onPress={() => {}}>
          <SearchItem item={item} onSendMessage={onSendMessage} />
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


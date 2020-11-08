import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Colors, Headings } from '../../../variables/variables';

type SearchFormProps = {
  search: string;
  onChangeText: (text: string) => void;
};

const SearchForm = ({ search, onChangeText, }: SearchFormProps) => {
  return (
    <View style={styles.header}>
      <MaterialIcon name="search" size={28} color={Colors.purpleDark} />
      <TextInput
        style={styles.input} 
        selectionColor={'grey'}
        placeholder="Find people"
        placeholderTextColor={Colors.purpleDark}
        value={search}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.purpleLighter,
    borderRadius: 35,
    marginHorizontal: 12,
    paddingVertical: 8
  },
  input: {
    fontSize: Headings.headingSmall,
    flex: 1,
    color: Colors.purpleDark,
    paddingLeft: 5
  }
});

export default SearchForm;


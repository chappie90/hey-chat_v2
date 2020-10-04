import React from 'react';
import { 
  View, 
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Colors, Headings } from '../../../variables/variables';

type SearchFormProps = {
  search: string;
  onChangeText: (text: string) => void;
  onCloseModal: () => void;
};

const SearchForm = ({ search, onChangeText, onCloseModal }: SearchFormProps) => {
  return (
    <View style={styles.header}>
      <MaterialIcon name="search" size={40} color={Colors.white} />
      <TextInput
        style={styles.input} 
        selectionColor={'grey'}
        placeholder="Find people..."
        placeholderTextColor="white"
        autoFocus
        value={search}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false} />
      <TouchableOpacity onPress={onCloseModal}>
        <MaterialIcon name="close" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryGreen,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  input: {
    fontSize: Headings.headingLarge,
    flex: 1,
    color: Colors.white,
    paddingLeft: 10
  }
});

export default SearchForm;


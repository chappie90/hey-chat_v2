import React from 'react';
import { 
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import ContactsItem from './ContactsItem';
import { Colors } from 'variables';

type AllContactsProps = {
  contacts: TContact[];
  onContactSelect: (contact: TContact) => void;
};

const AllContacts = ({ contacts, onContactSelect }: AllContactsProps) => {
  return (
    <SwipeListView
      // refreshControl={
      //   <RefreshControl
      //     onRefresh={() => getContacts({ username })}
      //     refreshing={isLoading}
      //     tintColor={Colors.primaryOrange} />
      // }
      disableRightSwipe
      data={contacts}
      //   onEndReached={() => {
      //   if (localContacts.length < contacts.length) {
      //     loadMoreContacts();
      //   }
      // }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={ (rowData, rowMap) => {
        // const chat = previousChats.filter(c => c.contact === rowData.item.user.username);
        return (
          <ContactsItem item={rowData.item} onContactSelect={onContactSelect} />
        );
      }}
      renderHiddenItem={ (rowData, rowMap) => (
        <View style={styles.rowBack}>
          <TouchableOpacity style={{ }} onPress={() => {}}>
            <View style={styles.deleteIcon}>
              <EntypoIcon name="trash" size={24} color={Colors.white} />
            </View>
          </TouchableOpacity>
        </View>
      )}
      rightOpenValue={-65}
    />
  );
};

const styles = StyleSheet.create({
  rowBack: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  deleteIcon: {
    backgroundColor: Colors.red,
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center' 
  }
});

export default AllContacts;


import React from 'react';
import { StyleSheet, RefreshControl, FlatList } from 'react-native';

import { Colors } from 'variables';
import CustomText from 'components/CustomText';
import ContactsItem from './ContactsItem';

type ActiveContactsProps = {
  contacts: TContact[];
  activeUsersCount: number;
  onContactSelect: (contact: TContact) => void;
};

const ActiveContacts = ({ contacts, activeUsersCount, onContactSelect }: ActiveContactsProps) => {

  if (activeUsersCount === 0) {
    return <CustomText style={styles.noResults}>No active users</CustomText>;
  }

  return (
    <FlatList
      // refreshControl={
      //   <RefreshControl
      //     onRefresh={() => getContacts({ username })}
      //     refreshing={isLoading}
      //     tintColor={Colors.primaryOrange} />
      // }
      data={contacts}
      //   onEndReached={() => {
      //   if (localContacts.length < contacts.length) {
      //     loadMoreContacts();
      //   }
      // }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => {
        // const chat = previousChats.filter(c => c.contact === rowData.item.user.username);
        return (
          <ContactsItem item={item} onContactSelect={onContactSelect} />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: 6, 
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
    backgroundColor: Colors.white
  },
  noResults: {
    textAlign: 'center',
    marginTop: 15
  }
});

export default ActiveContacts;


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { MainStackParams } from '../navigation/types';

type ContactsScreenProps = BottomTabScreenProps<MainStackParams, 'Contacts'>;

const ContactsScreen = ({ navigation }: ContactsScreenProps) => {
  return (
    <View styles={styles.container}>
      <Text>ContactsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ContactsScreen;
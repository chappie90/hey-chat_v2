import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactsScreen = () => {
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
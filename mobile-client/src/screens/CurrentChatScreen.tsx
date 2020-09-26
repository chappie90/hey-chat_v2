import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CurrentChatScreen = () => {
  return (
    <View styles={styles.container}>
      <Text>CurrentChatScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default CurrentChatScreen;
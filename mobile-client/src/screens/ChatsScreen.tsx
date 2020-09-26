import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ChatsScreen = (props) => {
  return (
    <View styles={styles.container}>
      <Text>ChatsScreen</Text>
      <Button 
        title="To Current Chat" 
        onPress={() => props.navigation.navigate('CurrentChat')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ChatsScreen;
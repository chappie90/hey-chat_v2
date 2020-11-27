import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

import { Context as AuthContext } from 'context/AuthContext';
import { Context as ChatsContext } from 'context/ChatsContext';
import { Colors } from 'variables';
import ChatsIcon from 'components/chats/chatsList/ChatsIcon';
import ChatsHeader from 'components/chats/chatsList/ChatsHeader';
import ChatsList from 'components/chats/chatsList/ChatsList';

type ChatsScreenRouteProp = RouteProp<MainStackParams, 'Chats'>;
type ChatsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainStackParams, 'Chats'>,
  StackNavigationProp<ChatsStackParams>
>;

type ChatsScreenProps = {
  route: ChatsScreenRouteProp;
  navigation: ChatsScreenNavigationProp;
};

const ChatsScreen = ({ route, navigation }: ChatsScreenProps) => {
  const { state: { userId, socketState } } = useContext(AuthContext);
  const { state: { chats }, getChats } = useContext(ChatsContext);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openModal = (): void => {
    setShowNewGroup(true);
  };

  useEffect(() => {
    (async () => {
      const response = await getChats(userId);
      if (response) setIsLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ChatsHeader openModal={openModal} />
      {isLoading ? 
        (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={Colors.yellowDark} />
          </View>
        ) :
        (
          chats.length > 0 ? 
            <ChatsList chats={chats} /> :
            <ChatsIcon />
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  spinnerContainer: {
    padding: 20
  }
});

export default ChatsScreen;
import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Button, 
  StyleSheet,
  TouchableOpacity
 } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';


import { Context as AuthContext } from '../context/AuthContext';
import { Context as ChatsContext } from '../context/ChatsContext';
import { MainStackParams, ChatsStackParams } from '../navigation/types';
import { Colors, Headings } from '../variables/variables';
import CustomText from '../components/CustomText';
import ChatsIcon from '../components/chats/chatsList/ChatsIcon';
import ChatsHeader from '../components/chats/chatsList/ChatsHeader';

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
      <Button 
        title="To Current Chat" 
        onPress={() => navigation.navigate('CurrentChat', {
          chatType: 'string',
          chatId: 6,
          contactName: 'string'
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  }
});

export default ChatsScreen;
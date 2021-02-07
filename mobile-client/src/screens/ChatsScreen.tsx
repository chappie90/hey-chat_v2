import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';

import { Colors } from 'variables';
import ChatsIcon from 'components/chats/chatsList/ChatsIcon';
import ChatsHeader from 'components/chats/chatsList/ChatsHeader';
import ChatsList from 'components/chats/chatsList/ChatsList';
import { chatsActions } from 'reduxStore/actions';
import Spinner from 'components/common/Spinner';

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
  const { user: { _id: userId } } = useSelector(state => state.auth);
  const { chats } = useSelector(state => state.chats);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();;

  useEffect(() => {
    (async () => {
      const response = await dispatch(chatsActions.getChats(userId));
      if (response) setIsLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ChatsHeader />
      {isLoading ? 
        <Spinner layout={styles.spinnerContainer} color={Colors.yellowDark} /> :
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
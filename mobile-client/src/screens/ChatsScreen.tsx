import React, { useState, useContext } from 'react';
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
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Context as AuthContext } from '../context/AuthContext';
import { MainStackParams, ChatsStackParams } from '../navigation/types';
import { Colors, Headings } from '../variables/variables';
import CustomText from '../components/CustomText';

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
  const { state: { socketState } } = useContext(AuthContext);
  const [showNewGroup, setShowNewGroup] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomText color={Colors.white} fontSize={Headings.headingLarge}>My Chats</CustomText>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowNewGroup(true)}>
          <MaterialIcon name="group-add" size={37} color={Colors.white} />
        </TouchableOpacity>
      </View>
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
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryOrange,
    paddingRight: 15,
    paddingLeft: 20,
    paddingTop: 65,
    paddingBottom: 10,
    height: 110
  },
  addButton: {
    marginTop: 2
  }
});

export default ChatsScreen;
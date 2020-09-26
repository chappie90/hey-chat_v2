import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ChatsScreen from '../screens/ChatsScreen';
import CurrentChatScreen from '../screens/CurrentChatScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Hide bottom tab navigator on current chat screen
const hideTabBar = route => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen;

  if (routeName === 'CurrentChat') return false;

  return true;
};

const ChatsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chats" component={ChatsScreen} />
      <Stack.Screen name="CurrentChat" component={CurrentChatScreen} />
    </Stack.Navigator>
  );
};

const MainFlow = () => {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen 
        name="ChatsStackNavigator" 
        component={ChatsStackNavigator} 
        options={({ route }) => ({
          tabBarVisible: hideTabBar(route)
        })}
      />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainFlow;
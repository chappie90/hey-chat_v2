import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StackScreenProps } from '@react-navigation/stack';

import { MainStackParams, ChatStackParams } from './types';
import ChatsScreen from '../screens/ChatsScreen';
import CurrentChatScreen from '../screens/CurrentChatScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors, Headings } from '../variables/variables';

// Hide bottom tab navigator on current chat screen
const hideTabBar = route => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen;

  if (routeName === 'CurrentChat') return false;

  return true;
};

const Tab = createBottomTabNavigator<MainStackParams>();
const Stack = createStackNavigator<ChatStackParams>();

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
    <Tab.Navigator 
      initialRouteName="Chats"
      tabBarOptions={{
        style: {
          backgroundColor: Colors.darkGrey
        },
        tabStyle: {
          paddingVertical: 4,
        },
        activeTintColor: Colors.primary,
        inactiveTintColor: Colors.white
      }}
    >
      <Tab.Screen 
        name="Chats" 
        component={ChatsStackNavigator} 
        options={({ route }) => ({
          tabBarVisible: hideTabBar(route),
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcon name="chat" size={22} color={focused ? Colors.primary : Colors.white} />
          ),
          tabBarBadge: 3,
        })}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome5 name="user-friends" size={22} color={focused ? Colors.primary : Colors.white} />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcon name="account-balance" size={22} color={focused ? Colors.primary : Colors.white} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default MainFlow;
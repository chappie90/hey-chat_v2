import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { MainStackParams, ChatsStackParams, ContactsStackParams } from './types';
import ChatsScreen from '../screens/ChatsScreen';
import CurrentChatScreen from '../screens/CurrentChatScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors } from '../variables/variables';

// Hide bottom tab navigator on current chat screen
const hideTabBar = (route: any) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen;

  if (routeName === 'CurrentChat') return false;

  return true;
};

const Tab = createBottomTabNavigator<MainStackParams>();
const ChatsStack = createStackNavigator<ChatsStackParams>();
const ContactsStack = createStackNavigator<ContactsStackParams>();

const ChatsStackNavigator = () => {
  return (
    <ChatsStack.Navigator>
      <ChatsStack.Screen 
        name="Chats" 
        component={ChatsScreen} 
        options={{ title: '', headerTransparent: true }} 
      />
      <ChatsStack.Screen name="CurrentChat" component={CurrentChatScreen} />
    </ChatsStack.Navigator>
  );
};

const ContactsStackNavigator = () => {
  return (
    <ContactsStack.Navigator>
      <ContactsStack.Screen 
        name="Contacts" 
        component={ContactsScreen} 
        options={{ title: '', headerTransparent: true }} 
      />
      <ContactsStack.Screen name="CurrentChat" component={CurrentChatScreen} />
    </ContactsStack.Navigator>
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
        component={ContactsStackNavigator}
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
import React from 'react';
import { View, Text, Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ChatsScreen from 'screens/ChatsScreen';
import CurrentChatScreen from 'screens/CurrentChatScreen';
import VideoCallScreen from 'screens/VideoCallScreen';
import ContactsScreen from 'screens/ContactsScreen';
import ProfileScreen from 'screens/ProfileScreen';
import CustomTabBar from './CustomTabBar';
import { Colors } from 'variables';

// Hide bottom tab navigator on current chat screen
const hideTabBar = (route: any) => {
  const routeName = getFocusedRouteNameFromRoute(route);
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
      <ChatsStack.Screen 
        name="CurrentChat" 
        component={CurrentChatScreen} 
        options={{ headerShown: false }}
      />
      <ChatsStack.Screen 
        name="VideoCall" 
        component={VideoCallScreen} 
      />
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
      <ContactsStack.Screen 
        name="CurrentChat" 
        component={CurrentChatScreen} 
        options={({ route }) => ({ title: route.params.contactName })}
      />
    </ContactsStack.Navigator>
  );
};

const MainFlow = () => {
  return (
    <Tab.Navigator 
      tabBar={props => <CustomTabBar { ...props } />}
      initialRouteName="Chats"
      tabBarOptions={{
        style: {
          backgroundColor: Colors.greyDark
        },
        tabStyle: {
          paddingVertical: 4,
        },
        activeTintColor: Colors.yellowDark,
        inactiveTintColor: Colors.white
      }}
    >
      <Tab.Screen 
        name="Chats" 
        component={ChatsStackNavigator} 
        options={({ route }) => ({
          tabBarVisible: hideTabBar(route),
          tabBarIcon: ({ size, focused }) => (
            <MaterialIcon name="chat" size={size} color={focused ? Colors.white : Colors.greyDark} />
          )
          // tabBarBadge: 3,
        })}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsStackNavigator}
        options={({ route }) => ({
          tabBarVisible: hideTabBar(route),
          tabBarIcon: ({ size, focused }) => (
            <FontAwesome5 name="user-friends" size={size} color={focused ? Colors.white : Colors.greyDark} />
          )
        })}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ size, focused }) => (
            <MaterialIcon name="account-balance" size={size} color={focused ? Colors.white : Colors.darkGrey} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default MainFlow;
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StarterScreen from '../screens/StarterScreen';

const Stack = createStackNavigator<AuthenticationStackParams>();

const AuthenticationFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Starter" 
        component={StarterScreen} 
        options={{ title: '', headerTransparent: true }} 
      />
    </Stack.Navigator>
  );
};

export default AuthenticationFlow;
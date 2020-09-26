import React from 'react';

import StarterScreen from '../screens/StarterScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AuthenticationFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Starter" component={StarterScreen} options={{ title: '', headerTransparent: true }} />
    </Stack.Navigator>
  );
};

export default AuthenticationFlow;
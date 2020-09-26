import React, { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { Context as AuthContext } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import AuthenticationFlow from './AuthenticationFlow';
import MainFlow from './MainFlow';

const Navigator = () => {
  const { state: { token } } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer >
      {token ? (
        <MainFlow />
      ) : (
        <AuthenticationFlow />
      )}
    </NavigationContainer>
  );
};

export default Navigator;

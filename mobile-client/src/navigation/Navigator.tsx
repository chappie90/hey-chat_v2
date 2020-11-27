import React, { useState, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { Context as AuthContext } from 'context/AuthContext';
import SplashScreen from 'screens/SplashScreen';
import AuthenticationFlow from './AuthenticationFlow';
import MainFlow from './MainFlow';

const Navigator = () => {
  const { state: { token }, autoSignin } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    autoSignin();
  }, []);

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

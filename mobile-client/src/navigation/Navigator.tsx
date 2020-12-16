import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import SplashScreen from 'screens/SplashScreen';
import AuthenticationFlow from './AuthenticationFlow';
import MainFlow from './MainFlow';
import { authActions } from 'reduxStore/actions';
import { navigationRef } from './NavigationRef';

const Navigator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.autoSignin());
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer ref={navigationRef} >
      {token ? (
        <MainFlow />
      ) : (
        <AuthenticationFlow />
      )}
    </NavigationContainer>
  );
};

export default Navigator;

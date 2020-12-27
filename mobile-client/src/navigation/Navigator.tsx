import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import AuthenticationFlow from './AuthenticationFlow';
import MainFlow from './MainFlow';
import { authActions } from 'reduxStore/actions';
import { navigationRef } from './NavigationRef';
import IncomingCallNotification from 'components/video/IncomingCallNotification';
import SplashScreen from 'screens/SplashScreen';

const Navigator = () => {
  const { token, initialLoad } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActions.autoSignin());
  }, []);

  if (initialLoad) return <SplashScreen />;

  return (
    <NavigationContainer ref={navigationRef} >
      <IncomingCallNotification />
      {token ? (
        <MainFlow />
      ) : (
        <AuthenticationFlow />
      )}
    </NavigationContainer>
  );
};

export default Navigator;

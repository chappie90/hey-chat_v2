import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import { useSelector, useDispatch } from 'react-redux';
import RNSplashScreen from 'react-native-splash-screen'

import { Animations } from 'assets';
import { authActions } from 'reduxStore/actions';
import { Colors } from 'variables';

const SplashScreen = () => {
  const { initialLoad } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const onAnimationFinish = (): void => {
    dispatch(authActions.setIsInitialLoad(false));
  };

  useEffect(() => {
    RNSplashScreen.hide();
  }, []);

  if (!initialLoad) return <></>;

  return (
    <>
      <StatusBar backgroundColor={Colors.greyLogo} barStyle='light-content' />
      <LottieView 
        source={ Animations.splash } 
        autoPlay 
        loop={false}
        onAnimationFinish={onAnimationFinish}
      />
    </>
  );
};

export default SplashScreen;
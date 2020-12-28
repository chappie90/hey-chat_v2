import React, { useState } from 'react';
import { 
  View, 
  StyleSheet
} from 'react-native';
import Dots from 'react-native-dots-pagination';
import { useDispatch } from 'react-redux';

import { Colors } from 'variables';
import ViewPager from 'components/ViewPager';
import CustomButton from 'components/CustomButton';
import ScaleViewAnim from 'components/animations/ScaleViewAnim';
import SigninScreen from './modals/SigninScreen';
import SignupScreen from './modals/SignupScreen';
import { authActions } from 'reduxStore/actions';

const StarterScreen = () => {
  const [showSignin, setShowSignin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [activeDot, setActiveDot] = useState(0);
  const dispatch = useDispatch();

  const closeModal = (): void => {
    setShowSignup(false);
    setShowSignin(false);
  };

  const toggleModals = (): void => {
    dispatch(authActions.setAuthError(''));

    if (showSignin) {
      setShowSignin(false);
      setShowSignup(true);
    }
    if (showSignup) {
      setShowSignup(false);
      setShowSignin(true);
    }
  };

  const onPressSignin = (): void => {
    setShowSignin(true);
  };

  const onPressSignup = (): void => {
    setShowSignup(true);
  };

  const onPageChange = (activeIndex: number): void => {
    setActiveDot(activeIndex);
  };

  return (
    <View style={styles.container}>
      <SignupScreen visible={showSignup} toggleModals={toggleModals} closeModal={closeModal} />
      <SigninScreen visible={showSignin} toggleModals={toggleModals} closeModal={closeModal} />
      <ViewPager onPageChange={onPageChange} />
      <View style={styles.dotsContainer}>
        <Dots 
          length={4} 
          active={activeDot} 
          activeDotWidth={40}
          passiveDotWidth={40}
          activeDotHeight={10}
          passiveColor={Colors.white}
          activeColor={Colors.yellowDark}  
        />
      </View>
      <ScaleViewAnim style={{ alignItems: 'center', marginTop: 'auto' }}>
        <CustomButton color={Colors.yellowDark} onPress={onPressSignup}> 
          Get Started
        </CustomButton>
        <CustomButton 
          style={styles.signinButton} 
          colorText={Colors.greyDark}
          onPress={onPressSignin}
        > 
          Sign In
        </CustomButton>
      </ScaleViewAnim>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.yellowLight,
    marginVertical: -45
  },
  dotsContainer: {
    marginTop: 70
  },
  signinButton: {
    marginBottom: 60
  }
});

export default StarterScreen;
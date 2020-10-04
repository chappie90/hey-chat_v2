import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet
} from 'react-native';

import { Colors } from '../variables/variables';
import ViewPager from '../components/ViewPager';
import CustomButton from '../components/CustomButton';
import ScaleViewAnim from '../components/animations/ScaleViewAnim';
import SigninScreen from './modals/SigninScreen';
import SignupScreen from './modals/SignupScreen';

const StarterScreen = () => {
  const [showSignin, setShowSignin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const closeModal = (): void => {
    setShowSignup(false);
    setShowSignin(false);
  };

  const toggleModals = (): void => {
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

  return (
    <View style={styles.container}>
      <SignupScreen visible={showSignup} toggleModals={toggleModals} closeModal={closeModal} />
      <SigninScreen visible={showSignin} toggleModals={toggleModals} closeModal={closeModal} />
      <ViewPager />
      <ScaleViewAnim style={{ alignItems: 'center' }}>
        <CustomButton color={Colors.primaryOrange} onPress={onPressSignup}> 
          Get Started
        </CustomButton>
        <CustomButton 
          style={styles.signinButton} 
          colorText={Colors.darkGrey}
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
    backgroundColor: Colors.lightGrey,
  },
  signinButton: {
    marginBottom: 20,
    padding: 10
  }
});

export default StarterScreen;
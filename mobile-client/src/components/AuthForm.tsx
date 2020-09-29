import React, { useState, useRef, Fragment } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity
} from 'react-native';

import { Colors, Fonts, Headings } from '../variables/variables';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import ErrorMessage from './ErrorMessage';

type AuthFormTypes = {
  heading: string;
  buttonText: string;
  onSubmitCallback: (username: string, password: string) => any | undefined;
  toggleModals: () => void;
  toggleModalPrompt: string;
  toggleModalLink: string;
};

const AuthForm = ({ 
  heading, 
  buttonText, 
  toggleModalPrompt, 
  toggleModalLink,
  onSubmitCallback, 
  toggleModals
}: AuthFormTypes) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameIsValid, setUsernameIsValid] = useState<boolean | null>(null);
  const [passwordIsValid, setPasswordIsValid] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputEl = useRef<TextInput>(null);

  const focusInput = (): void => {
    if (inputEl.current) {
      inputEl.current.focus();
    } 
  };

  const usernameChanged = (text: string): void => {
    if (text.trim().length === 0) {
      setUsernameIsValid(false);
      setUsernameError('Username can\'t be an empty value');
    } else if (/[^a-zA-Z0-9 ]/.test(text)) {
      setUsernameIsValid(false); 
      setUsernameError('Username must contain only letters, number and spaces');
    } else {
      setUsernameIsValid(true);
      setUsernameError('');
    }
    setUsername(text); 
  };

  const passwordChanged = (text: string): void => {
    text.trim().length < 8 ? setPasswordIsValid(false) : setPasswordIsValid(true);
    setPassword(text);
  };

  const onFormSubmit = async (): Promise<void> => {
    usernameChanged(username);
    if (passwordIsValid === null) {
      setPasswordIsValid(false);
    }
    if (!usernameIsValid || !passwordIsValid) {
      return;
    }

    const response = await onSubmitCallback(username, password);
    if (response) {
      let errorMsg;
      if (response.data && response.data.message) {
        errorMsg = response.data.message;
      } else {
        errorMsg = 'Something went wrong with your request!';
      }
      setShowErrorMsg(true);
      setErrorMsg(errorMsg);
    }
  };

  const onClearErrorMsg = (): void => {
    setShowErrorMsg(false);
    setErrorMsg('');
  };

  return (
    <View style={styles.container}>
      <CustomText 
        color={Colors.primary}
        fontSize={Headings.headingExtraLarge}
        fontWeight={Fonts.semiBold} 
        style={styles.header}>
          {heading}
      </CustomText>
      <TextInput 
        style={styles.input} 
        placeholder="Username"
        value={username}
        onChangeText={usernameChanged}
        returnKeyType="next"
        onSubmitEditing={focusInput} 
        autoCapitalize="none"
        placeholderTextColor={Colors.grey}
        // blurOnSubmit={false}
        autoCorrect={false} />
      {usernameIsValid !== null && !usernameIsValid && (
          <CustomText color={Colors.red} fontSize={Headings.headingSmall}>
            {usernameError}
          </CustomText>
      )}
      <TextInput
        style={styles.input} 
        placeholder="Password" 
        value={password}
        onChangeText={passwordChanged}
        autoCorrect={false}
        autoCapitalize="none"
        secureTextEntry
        placeholderTextColor={Colors.grey}
        ref={inputEl}
      />
      {passwordIsValid !== null && !passwordIsValid && (
          <CustomText color={Colors.red} fontSize={Headings.headingSmall}>
            Password must be at least 8 characters long    
          </CustomText>
      )}
      <CustomButton 
        color={Colors.primary}
        buttonSize="big"
        style={styles.button} 
        onPress={onFormSubmit}
      >
        {buttonText}
      </CustomButton>
      <TouchableOpacity style={{ marginTop: 10 }} onPress={toggleModals}>
        <Text style={styles.toggleText}>{toggleModalPrompt}</Text>
        <Text style={styles.toggleText}>{toggleModalLink}</Text>
      </TouchableOpacity>
      <ErrorMessage 
        visible={showErrorMsg} 
        heading="Something went wrong with your signup..." 
        message={errorMsg}
        buttonText="Dismiss"
        onClearMessage={onClearErrorMsg}
      />
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: {
    width: '100%',
    paddingHorizontal: 30
  },
  header: {
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    height: 60,
    fontSize: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightGrey
  },
  button: {
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 25
  },
  toggleText: {
    fontSize: Headings.headingSmall,
    textAlign: 'center',
    color: Colors.darkGrey
  }
});

export default AuthForm;
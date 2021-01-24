import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Colors, Fonts, Headings } from 'variables';
import CustomText from 'components/CustomText';
import CustomButton from 'components/common/CustomButton';
import { authActions } from 'reduxStore/actions';
import Spinner from 'components/common/Spinner';

type AuthFormTypes = {
  heading: string;
  buttonText: string;
  onSubmitCallback: (username: string, password: string) => any | undefined;
  toggleModals: () => void;
  toggleModalPrompt: string;
  toggleModalLink: string;
  toggleOpacityArrow: (isInputFocused: boolean) => void;
};

const AuthForm = ({ 
  heading, 
  buttonText, 
  toggleModalPrompt, 
  toggleModalLink,
  onSubmitCallback, 
  toggleModals,
  toggleOpacityArrow
}: AuthFormTypes) => {
  const { isAuthenticating, authError } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameIsValid, setUsernameIsValid] = useState<boolean | null>(null);
  const [passwordIsValid, setPasswordIsValid] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState('');
  const inputEl = useRef<TextInput>(null);
  const ERRORS = {
    username: {
      isEmpty: 'Username can\'t be an empty value',
      allowedChars: 'Username must contain only letters, number and spaces'
    },
    password: {
      minLength: 'Password must be at least 8 characters long'
    }
  };

  const focusInput = (): void => {
    if (inputEl.current) {
      inputEl.current.focus();
    } 
  };

  const usernameChanged = (text: string): void => {
    if (text.trim().length === 0) {
      setUsernameIsValid(false);
      setUsernameError(ERRORS.username.isEmpty);
    } else if (/[^a-zA-Z0-9 ]/.test(text)) {
      setUsernameIsValid(false); 
      setUsernameError(ERRORS.username.allowedChars);
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

    dispatch(authActions.isAuthenticating(true));

    dispatch(onSubmitCallback(username, password));
  };

  const onClearErrorMsg = (): void => {
    dispatch(authActions.setAuthError(''));
  };

  return (
    <View style={styles.container}>
      {isAuthenticating && <Spinner layout={styles.spinner} />}
      {!!authError &&
        <View style={styles.formError}>
          <CustomText fontSize={Headings.headingSmall} color={Colors.red}>
            {authError}
          </CustomText>
          <TouchableOpacity style={styles.closeErrorBtn} onPress={onClearErrorMsg}>
            <MaterialIcon color={Colors.red} name="close" size={22} />
          </TouchableOpacity>
        </View>
      }
      <CustomText 
        color={Colors.yellowDark}
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
        placeholderTextColor={Colors.greyDark}
        onFocus={() => toggleOpacityArrow(true)} 
        onBlur={() => toggleOpacityArrow(false)}
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
        placeholderTextColor={Colors.greyDark}
        onFocus={() => toggleOpacityArrow(true)} 
        onBlur={() => toggleOpacityArrow(false)}
        ref={inputEl}
      />
      {passwordIsValid !== null && !passwordIsValid && (
          <CustomText color={Colors.red} fontSize={Headings.headingSmall}>
            {ERRORS.password.minLength}  
          </CustomText>
      )}
      <CustomButton 
        buttonStyle={styles.buttonStyle} 
        layout={styles.buttonLayout}
        onPress={onFormSubmit}
      >
          {buttonText}
      </CustomButton>
      <TouchableOpacity style={{ marginTop: 10 }} onPress={toggleModals}>
        <Text style={styles.toggleText}>{toggleModalPrompt}</Text>
        <Text style={styles.toggleText}>{toggleModalLink}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: {
    width: '100%',
    paddingHorizontal: 50
  },
  header: {
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    height: 60,
    fontSize: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.greyLight
  },
  buttonStyle: {
    backgroundColor: Colors.yellowDark,
    justifyContent: 'center',
    width: 180,
    height: 50,
    borderRadius: 35,
  },
  buttonLayout: {
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 55,
    flexDirection: 'row'
  },
  toggleText: {
    fontSize: Headings.headingSmall,
    textAlign: 'center',
    color: Colors.greyDark
  },
  spinner: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
  },
  formError: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingLeft: 25,
    paddingRight: 20,
    backgroundColor: Colors.redLight,
    borderRadius: 25,
    marginBottom: 15
  },
  closeErrorBtn: {
    marginLeft: 15
  }
});

export default AuthForm;
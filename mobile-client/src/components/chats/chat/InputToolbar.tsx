import React from 'react';
import { 
  View,
  StyleSheet, 
  TextInput,
  TouchableOpacity
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import Ionicon from 'react-native-vector-icons/Ionicons';

import CustomText from '../../../components/CustomText';
import { Colors, Fonts, Headings } from '../../../variables/variables';

type InputToolbarProps = {
  message: string;
  onChangeText: (text: string) => void;
  onSendMessage: (text: string) => void;
};

const InputToolbar = ({ message, onChangeText, onSendMessage }: InputToolbarProps) => {
  const takePhotoHandler = () => {

  };

  const choosePhotoHandler = () => {

  };

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <TouchableOpacity style={{paddingHorizontal: 5}} onPress={takePhotoHandler}>
          <MaterialIcon color={Colors.grey} name="camera-alt" size={28} />
        </TouchableOpacity>
        <TouchableOpacity style={{paddingHorizontal: 5}} onPress={choosePhotoHandler}>
          <Ionicon color={Colors.grey} name="md-images" size={26} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input} 
        selectionColor={'grey'}
        placeholder="Type a message..."
        placeholderTextColor={Colors.yellowDark}
        autoFocus
        multiline
        value={message}
        onChangeText={onChangeText}
        autoCorrect={false} 
      />
      <TouchableOpacity 
        style={styles.sendButton} 
        onPress={() => onSendMessage(message)}
        disabled={!message}
      >
        <View style={styles.sendIcon}>
          <FontAwesomeIcon name="send" size={17} color={message ? Colors.white : Colors.yellowLight} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1, 
    borderTopColor: Colors.greyLight
  },
  actions: {
    flexDirection:'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 2
  },
  input: {
    flex: 1,
    minHeight: 38,
    borderRadius: 35,
    backgroundColor: Colors.yellowLight,
    paddingLeft: 10,
    paddingRight: 40,
    paddingTop: 10,
    paddingBottom: 7
  },
  sendButton: {
    position: 'absolute',
    right: 16,
    top: 12
  },
  sendIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 1,
    backgroundColor: Colors.yellowDark,
    borderRadius: 15,
    width: 30,
    height: 30
  }
});

export default InputToolbar;

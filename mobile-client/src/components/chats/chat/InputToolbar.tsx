import React from 'react';
import { 
  View,
  StyleSheet, 
  TextInput,
  TouchableOpacity
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

import CustomText from '../../../components/CustomText';
import { Colors, Fonts, Headings } from '../../../variables/variables';

type InputToolbarProps = {
  message: string;
  onChangeText: (text: string) => void;
};

const InputToolbar = ({ message, onChangeText }: InputToolbarProps) => {
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
        placeholderTextColor={Colors.darkGrey}
        autoFocus
        multiline
        value={message}
        onChangeText={onChangeText}
        autoCorrect={false} 
      />
      <TouchableOpacity style={styles.sendButton} onPress={() => {}}>
        <MaterialIcon name="send" size={26} color={message ? Colors.primaryOrange : Colors.grey} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1, 
    borderTopColor: Colors.lightGrey
  },
  actions: {
    flexDirection:'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 2
  },
  input: {
    flex: 1,
    minHeight: 32,
    borderRadius: 18,
    backgroundColor: Colors.lightGrey,
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 7
  },
  sendButton: {
    paddingHorizontal: 8,
    paddingVertical: 3
  }
});

export default InputToolbar;

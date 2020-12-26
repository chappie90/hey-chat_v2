import React, { useState, useRef } from 'react';
import { 
  View,
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

import { Colors, Headings } from 'variables';
import ToolbarActions from './ToolbarActions';

type InputToolbarProps = {
  message: string;
  onChangeText: (text: string) => void;
  onSendMessage: (text: string) => void;
  showActions: boolean;
  toggleActions: () => void;
  showCamera: () => void;
  showLibrary: () => void;
};

const InputToolbar = ({ 
  message, 
  onChangeText, 
  onSendMessage,
  showActions,
  toggleActions,
  showCamera,
  showLibrary
}: InputToolbarProps) => {
  const backgroundColorAnim = useRef(new Animated.Value(0));
  const rotateAnim = useRef(new Animated.Value(0));

  const onToggleActions = (): void => {
    toggleActions();

    Animated.timing(
      backgroundColorAnim.current, { 
        toValue: showActions ? 0 : 1,
        duration: 200,
        useNativeDriver: false
      }
    ).start();
    Animated.timing(
      rotateAnim.current, { 
        toValue: showActions ? 0 : 1,
        duration: 200,
        useNativeDriver: false
      }
    ).start();
  };

  return (
    <View style={styles.container}>
      <ToolbarActions 
        isVisible={showActions} 
        showCamera={showCamera}
        showLibrary={showLibrary}
      />
      <TouchableWithoutFeedback onPress={onToggleActions}>
        <Animated.View 
          style={[
            styles.plusIcon,
            { 
              backgroundColor: backgroundColorAnim.current.interpolate({
                inputRange: [0, 1],
                outputRange: [Colors.yellowLight, Colors.purpleDark]
              }),
              transform: [
                { rotate: rotateAnim.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg']
                }) }
              ]
            }
          ]}
        >
          <MaterialCommunityIcon 
            color={showActions ? Colors.white : Colors.yellowDark} 
            name="plus" 
            size={34} 
          />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TextInput
        style={styles.input} 
        selectionColor={Colors.greyDark}
        placeholder="Type a message..."
        placeholderTextColor={Colors.yellowDark}
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
    marginTop: 'auto',
    alignItems: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  plusIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 19,
    width: 38,
    height: 38,
    marginRight: 8
  },
  input: {
    flex: 1,
    minHeight: 38,
    borderRadius: 35,
    backgroundColor: Colors.yellowLight,
    paddingLeft: 10,
    paddingRight: 40,
    paddingTop: 10,
    paddingBottom: 7,
    fontSize: Headings.headingSmall
  },
  sendButton: {
    position: 'absolute',
    right: 15,
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

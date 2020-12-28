import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';

import { Colors, Fonts, Headings } from 'variables';

type CustomButtonProps = {
  buttonStyle?: any;
  textStyle?: any;
  layout?: any;
  onPress: (event: GestureResponderEvent) => void;
  children: ReactNode;
};

const CustomButton = ({ 
  buttonStyle, 
  textStyle,
  layout,  
  onPress, 
  children 
}: CustomButtonProps) => {
  return (
    <TouchableOpacity style={{ ...layout }} onPress={onPress}>
      <View style={{ ...buttonStyle }}>
        <Text style={[ 
          { 
            color: Colors.white,
            fontFamily: Fonts.bold, 
            fontSize: Headings.headingMedium,
            textAlign: 'center'
          }, 
          { ...textStyle } 
        ]}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native';

import { Colors, Fonts, Headings } from 'variables';

type CustomButtonProps = {
  buttonStyle?: any;
  textStyle?: any;
  layout?: any;
  activeOpacity?: number;
  onPress: (event: GestureResponderEvent) => void;
  children: ReactNode;
};

const CustomButton = ({ 
  buttonStyle, 
  textStyle,
  layout,  
  activeOpacity,
  onPress, 
  children 
}: CustomButtonProps) => {
  let buttonStyles;

  if (Array.isArray(buttonStyle)) {
    buttonStyles = buttonStyle.map((style: any) => ({ ...style }));
  } else {
    buttonStyles = { ...buttonStyle };
  }

  return (
    <TouchableOpacity activeOpacity={activeOpacity ? activeOpacity : 0.2} style={{ ...layout }} onPress={onPress}>
      <View style={buttonStyles}>
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
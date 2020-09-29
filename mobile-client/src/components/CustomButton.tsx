import React, { ReactNode, CSSProperties } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  GestureResponderEvent 
} from 'react-native';

import { Colors, Fonts, Headings } from '../variables/variables';

type CustomButtonProps = {
  color?: string;
  colorText?: string;
  textFontSize?: number;
  textFontWeight?: string;
  buttonSize?: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: CSSProperties;
  children: ReactNode;
};

const CustomButton = ({ 
  color, 
  colorText, 
  textFontWeight,
  textFontSize,
  buttonSize, 
  onPress, 
  style, 
  children 
}: CustomButtonProps) => {
  let paddingHorizontal;

  if (buttonSize === 'big') {
    paddingHorizontal = 50;
  } else if (buttonSize === 'small') {
    paddingHorizontal = 10;
  } else {
    paddingHorizontal = 30;
  }

  return (
    <TouchableOpacity style={{ ...style }} onPress={onPress}>
      <View style={[ 
        styles.button, 
        { 
          backgroundColor: color,
          paddingHorizontal: paddingHorizontal
        } 
      ]}>
        <Text style={{ 
            color: colorText ? colorText : Colors.white,
            fontSize: textFontSize ? textFontSize : Headings.headingMedium,
            fontFamily: textFontWeight ? textFontWeight : Fonts.semiBold
        }}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 7,
    borderRadius: 3
  }
});

export default CustomButton;
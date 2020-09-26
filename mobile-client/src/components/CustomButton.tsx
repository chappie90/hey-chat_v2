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
  buttonBig?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  style?: CSSProperties;
  children: ReactNode;
};

const CustomButton = ({ 
  color, 
  colorText, 
  textFontWeight,
  textFontSize,
  buttonBig, 
  onPress, 
  style, 
  children 
}: CustomButtonProps) => {
  return (
    <TouchableOpacity style={{ ...style }} onPress={onPress}>
      <View style={[ 
        styles.button, 
        { 
          backgroundColor: color,
          paddingHorizontal: buttonBig ? 50 : 30
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
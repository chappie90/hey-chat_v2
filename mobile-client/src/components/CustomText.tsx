import React, { CSSProperties, ReactNode } from 'react';
import { Text, ColorPropType } from 'react-native';

import { Colors, Fonts, Headings } from '../variables/variables';

type CustomTextProps = {
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const CustomText = ({ 
  color, 
  fontSize, 
  fontWeight, 
  style, 
  children 
}: CustomTextProps) => {
  return (
    <Text style={{ 
      ...style,  
      color: color ? color: Colors.greyDark,
      fontSize: fontSize ? fontSize : Headings.headingMedium,
      fontFamily: fontWeight ? fontWeight : Fonts.regular
    }}>
      {children}
    </Text>
  );
};

export default CustomText;

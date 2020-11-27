import React, { CSSProperties, ReactNode } from 'react';
import { Text } from 'react-native';

import { Colors, Fonts, Headings } from 'variables';

type CustomTextProps = {
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  numberOfLines?: number;
  ellipsize?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const CustomText = ({ 
  color, 
  fontSize, 
  fontWeight, 
  numberOfLines,
  ellipsize,
  style, 
  children 
}: CustomTextProps) => {
  return (
    <Text 
      style={{ 
        ...style,  
        color: color ? color: Colors.greyDark,
        fontSize: fontSize ? fontSize : Headings.headingMedium,
        fontFamily: fontWeight ? fontWeight : Fonts.regular
      }}
      numberOfLines={numberOfLines}
      ellipsize={ellipsize}
    >
      {children}
    </Text>
  );
};

export default CustomText;

import React from 'react';
import { View, ViewProps } from 'react-native';

export const ScreenContainer = ({ children, style, ...props }: ViewProps) => {
  return (
    <View style={[{ flex: 1 }, style]} {...props}>
      {children}
    </View>
  );
};

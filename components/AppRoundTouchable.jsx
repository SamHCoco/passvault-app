import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import AppIcon from './AppIcon';

import { LIGHT_GREY } from '../constants/colors';

const AppRoundTouchable = ({ iconName, iconSize, iconColor, iconLibrary, onPress, touchableStyle, iconStyle, text }) => {
  const containerStyle = touchableStyle ? touchableStyle : styles.container;
  const textStyle = textStyle ? textStyle : styles.text;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={containerStyle}>
        {text ? (
          <Text style={textStyle}>{text}</Text>
        ) : (
          <AppIcon name={iconName} 
                   size={iconSize} 
                   color={iconColor} 
                   library={iconLibrary} 
                   iconStyle={iconStyle} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    marginLeft: 25,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppRoundTouchable;

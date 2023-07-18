import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text, Dimensions } from 'react-native';

import AppIcon from './AppIcon';
import { LIGHT_GREY, WHITE } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

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
    width: screenWidth * 0.2430,
    height: screenWidth * 0.2430,
    borderRadius: screenWidth * 0.3641,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: screenWidth * 0.0024,
    borderColor: LIGHT_GREY,
    marginLeft: screenWidth * 0.0608,
  },
  text: {
    fontSize: screenWidth * 0.0462,
    fontWeight: 'bold',
    color: WHITE,
  },
});

export default AppRoundTouchable;

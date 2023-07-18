import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

import { LIGHT_GREY } from '../constants/colors';
import AppIcon from './AppIcon';

const { width: screenWidth } = Dimensions.get('window');

const AppCredentialMetric = ({ 
      iconName, 
      iconSize, 
      iconColor, 
      iconLibrary, 
      text,
      textColor, 
      subText, 
      onPress, 
      textStyle, 
      subTextStyle }) => {
  const labelStyle = textStyle ? textStyle : styles.label;
  const subLabelStyle = subTextStyle ? subTextStyle : styles.subLabel;
  const dynamicTextStyle = textColor ? { ...labelStyle, color: textColor } : labelStyle;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.row}>
          <AppIcon name={iconName} size={iconSize} color={iconColor} library={iconLibrary} iconStyle={styles.icon} />
        </View>
        <View style={styles.labels}>
          <Text style={dynamicTextStyle}>{text}</Text>
          <Text style={subLabelStyle}>{subText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    borderColor: 'black',
    borderRadius: screenWidth * 0.1217,
    padding: screenWidth * 0.0073,
    flexDirection: 'row',
    width: screenWidth * 0.2679,
    height: screenWidth * 0.2679,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: screenWidth * 0.0122,
  },
  labels: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenWidth * 0.0243,
  },
  label: {
    fontSize: screenWidth * 0.0486,
    marginRight: screenWidth * 0.0243,
    fontWeight: 'bold',
  },
  icon: {
    width: screenWidth * 0.1217,
    height: screenWidth * 0.1217,
  },
  subLabel: {
    fontSize: screenWidth * 0.0413,
    fontStyle: 'italic',
    color: LIGHT_GREY,
  },
});

export default AppCredentialMetric;

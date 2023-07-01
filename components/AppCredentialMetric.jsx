import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { LIGHT_GREY } from '../constants/colors';

import AppIcon from './AppIcon';

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
        borderRadius: 50, // Modified value for perfect circle
        padding: 3,
        flexDirection: 'row',
        width: 110, // Modify the width and height according to your needs
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5
      },
      labels: {
        flexDirection: 'column',
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      label: {
        fontSize: 20,
        marginRight: 10,
        fontWeight: 'bold'
      },
      icon: {
        width: 50,
        height: 50,
      },
      subLabel: {
        fontSize: 17,
        fontStyle: 'italic',
        color: LIGHT_GREY
      },
});

export default AppCredentialMetric;

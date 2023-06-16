import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

import AppIcon from './AppIcon';

const AppCredentialMetric = ({ iconName, iconSize, iconColor, iconLibrary, text, subText }) => {
  return (
    <TouchableOpacity onPress={() => console.log(text + ' pressed.')}>
      <View style={styles.container}>
        <View style={styles.row}>
          <AppIcon name={iconName} size={iconSize} color={iconColor} library={iconLibrary} iconStyle={styles.icon} />
        </View>
        <View style={styles.labels}>
          <Text style={styles.label}>{text}</Text>
          <Text style={styles.subLabel}>{subText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'grey',
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
        fontSize: 16,
        marginRight: 10,
      },
      icon: {
        width: 50,
        height: 50,
      },
      subLabel: {
        fontSize: 14,
        fontStyle: 'italic',
      },
});

export default AppCredentialMetric;

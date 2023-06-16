import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import AppIcon from './AppIcon';

const AppRoundTouchable = ({ iconName, iconSize, iconColor, iconLibrary }) => {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <AppIcon name={iconName} size={iconSize} color={iconColor} library={iconLibrary} />
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
    borderColor: 'gray',
    marginLeft: 25
  },
});

export default AppRoundTouchable;

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Dimensions } from 'react-native';
import { LIGHT_GREEN } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

const AppToggleButton = ({ label, initialValue, onToggle }) => {
  const [value, setValue] = useState(initialValue);

  const handleToggle = () => {
    const newValue = !value;
    setValue(newValue);
    onToggle(newValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={handleToggle}
        trackColor={{ false: '#767577', true: LIGHT_GREEN }}
        thumbColor='#f4f3f4'
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: screenWidth * 0.0487,
    paddingHorizontal: screenWidth * 0.0388,
    paddingVertical: screenWidth * 0.0194,
    marginBottom: screenWidth * 0.0243,
    width: screenWidth * 0.6083,
  },
  label: {
    flex: 1,
    fontSize: screenWidth * 0.0388,
    color: '#333',
  },
  switch: {
    marginLeft: screenWidth * 0.0243,
  },
});

export default AppToggleButton;

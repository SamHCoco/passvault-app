import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

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
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
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
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
    width: 250
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  switch: {
    marginLeft: 10,
  },
});

export default AppToggleButton;

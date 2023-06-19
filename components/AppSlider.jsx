import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';

function AppSlider({ label, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Slider
        style={styles.slider}
        maximumValue={15}
        minimumValue={5}
        minimumTrackTintColor="#307ecc"
        maximumTrackTintColor="#000000"
        step={1}
        value={value}
        onValueChange={onValueChange}
      />
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginLeft: 27
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  slider: {
    width: 200,
    height: 40,
    marginVertical: 10,
  },
  value: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AppSlider;

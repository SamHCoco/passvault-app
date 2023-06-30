import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { LIGHT_GREEN } from '../constants/colors';

function AppSlider({ label, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Slider
        style={styles.slider}
        maximumValue={15}
        minimumValue={5}
        minimumTrackTintColor={LIGHT_GREEN}
        maximumTrackTintColor="#000000"
        thumbTintColor="darkgrey"
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
    marginVertical: 6,
    marginLeft: 27
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  slider: {
    width: 200,
    // height: 70,
    // marginVertical: 5,
    // transform: [{ scaleY: 2 }]
  },
  value: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AppSlider;

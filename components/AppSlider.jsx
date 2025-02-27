import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { LIGHT_GREEN, LIGHT_GREY } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

function AppSlider({ label, value, onValueChange }) {
  return (
    <View style={styles.container}>
      <View style={styles.sliderRow}>
          <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Slider
              style={styles.slider}
              maximumValue={15}
              minimumValue={5}
              minimumTrackTintColor={LIGHT_GREEN}
              maximumTrackTintColor="#000000"
              thumbTintColor={LIGHT_GREY}
              step={1}
              value={value}
              onValueChange={onValueChange}
            />
            <Text style={styles.value}>{value}</Text>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align contents at the flex-start
    backgroundColor: '#f9f9f9',
    borderRadius: screenWidth * 0.0487,
    paddingHorizontal: screenWidth * 0.0388,
    paddingVertical: screenWidth * 0.0194,
    marginBottom: screenWidth * 0.0243,
    width: screenWidth * 0.90, // Set container width to 95% of screen width
  },
  sliderRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: screenWidth * 0.0097,
    marginVertical: screenWidth * 0.0146,
    width: '100%', // Ensure content stays within the container
  },
  label: {
    fontSize: screenWidth * 0.0388,
    marginLeft: screenWidth * 0.0243
  },
  slider: {
    width: '65%', // Adjust the slider width as needed
  },
  value: {
    fontSize: screenWidth * 0.0412,
    marginLeft: screenWidth * 0.0024,
  },
});

export default AppSlider;

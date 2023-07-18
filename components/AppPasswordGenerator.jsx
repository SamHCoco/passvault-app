import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';

const { width: screenWidth } = Dimensions.get('window');

function AppPasswordGenerator(props) {
  const [sliderValue, setSliderValue] = useState(5);
  const [number, setNumber] = useState(true);
  const [specialChars, setSpecialChars] = useState(true);
  const [upperCase, setUpperCase] = useState(true);
  const [lowerCase, setLowerCase] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Characters</Text>
        <Slider
          style={styles.slider}
          maximumValue={15}
          minimumValue={5}
          minimumTrackTintColor="#307ecc"
          maximumTrackTintColor="#000000"
          step={1}
          value={sliderValue}
          onValueChange={(value) => setSliderValue(value)}
        />
        <Text style={styles.value}>{sliderValue}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Numbers</Text>
        <Checkbox
          value={number}
          onValueChange={setNumber}
          color={number ? '#4630EB' : undefined}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Special Characters</Text>
        <Checkbox
          value={specialChars}
          onValueChange={setSpecialChars}
          color={specialChars ? '#4630EB' : undefined}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Inc. Uppercase</Text>
        <Checkbox
          value={upperCase}
          onValueChange={setUpperCase}
          color={upperCase ? '#4630EB' : undefined}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Inc. Lowercase</Text>
        <Checkbox
          value={lowerCase}
          onValueChange={setLowerCase}
          color={lowerCase ? '#4630EB' : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderWidth: screenWidth * 0.0024,
    width: screenWidth * 0.9253,
    height: screenWidth * 0.4136,
    marginHorizontal: screenWidth * 0.0122,
    borderRadius: screenWidth * 0.1217,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: screenWidth * 0.0097,
    marginLeft: screenWidth * 0.0657,
  },
  label: {
    fontSize: screenWidth * 0.0388,
    marginRight: screenWidth * 0.0243,
  },
  slider: {
    width: screenWidth * 0.4861,
    height: screenWidth * 0.0973,
    marginVertical: screenWidth * 0.0243,
  },
  value: {
    fontSize: screenWidth * 0.0388,
    marginLeft: screenWidth * 0.0243,
  },
});

export default AppPasswordGenerator;
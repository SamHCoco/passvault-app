import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';

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
    // justifyContent: 'center',
    borderWidth: 1,
    width: 380,
    height: 170,
    marginHorizontal: 5,
    borderRadius: 50,
  },
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

export default AppPasswordGenerator;

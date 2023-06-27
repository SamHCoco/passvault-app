import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Vibration, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

import AppRoundTouchable from '../components/AppRoundTouchable';
import { BLACK, WHITE } from '../constants/colors';

const CreatePinScreen = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [pinEntered, setPinEntered] = useState([]);
  const [confirmPinMode, setConfirmPinMode] = useState(false); // Track if confirm pin mode is active
  const [storedPin, setStoredPin] = useState('');

  const handlePinPress = (number) => {
    const newPin = pin + number;
    setPin(newPin);
    setPinEntered([...pinEntered, number]);

    if (newPin.length === 4) {
      if (confirmPinMode) {
        confirmPin(newPin);
      } else {
        setConfirmPinMode(true);
        setPin('');
        setPinEntered([]);
        setStoredPin(newPin);
      }
    }
  };

  const handleDeletePress = () => {
    const newPin = pin.slice(0, -1);
    setPin(newPin);
    setPinEntered(pinEntered.slice(0, -1));
  };

  const confirmPin = (enteredPin) => {
    if (enteredPin === storedPin) {
      storePin(enteredPin);
    } else {
      // Handle incorrect pin
      setPin('');
      setPinEntered([]);
      vibrate();
    }
  };

  const storePin = async (newPin) => {
    try {
      await SecureStore.setItemAsync('passvault-app-pin', newPin);
      navigation.navigate('Tabs');
    } catch (error) {
      // Handle error
    }
  };

  const vibrate = () => {
    Vibration.vibrate([0, 500]); // Vibrate for 500ms
  };

  return (
    <View style={styles.container}>
          <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>{confirmPinMode ? 'Confirm Pin' : 'Create Pin'}</Text>
        <View style={styles.circleContainer}>
          {[1, 2, 3, 4].map((index) => (
            <View
              key={index}
              style={[styles.circle, pinEntered.length >= index && styles.filledCircle]}
            >
              {pinEntered.length >= index && (
                <Text style={styles.circleText}>{pinEntered[index - 1]}</Text>
              )}
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.row}>
            {[1, 2, 3].map((number) => (
              <TouchableOpacity
                key={number}
                style={styles.button}
                onPress={() => handlePinPress(number.toString())}
              >
                <Text style={styles.buttonText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.row}>
            {[4, 5, 6].map((number) => (
              <TouchableOpacity
                key={number}
                style={styles.button}
                onPress={() => handlePinPress(number.toString())}
              >
                <Text style={styles.buttonText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.row}>
            {[7, 8, 9].map((number) => (
              <TouchableOpacity
                key={number}
                style={styles.button}
                onPress={() => handlePinPress(number.toString())}
              >
                <Text style={styles.buttonText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <View style={styles.emptyButton} />
            <TouchableOpacity
              style={[styles.button, styles.buttonLast]}
              onPress={() => handlePinPress('0')}
            >
              <Text style={styles.buttonText}>0</Text>
            </TouchableOpacity>
            <AppRoundTouchable
              iconName="backspace"
              iconSize={35}
              iconColor={BLACK}
              iconLibrary="ion"
              onPress={handleDeletePress}
              touchableStyle={styles.roundTouchable}
              iconStyle={styles.roundTouchableIcon}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: WHITE, // Adjust the overlay opacity as needed
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth * 0.8, // Adjust the content width as needed (80% of screen width)
  },
  title: {
    fontSize: screenWidth * 0.05, // Adjust the font size based on screen width
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.025, // Adjust the margin bottom based on screen height
    color: BLACK, // Adjust the text color as needed
  },
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: screenHeight * 0.025, // Adjust the margin bottom based on screen height
  },
  circle: {
    width: screenWidth * 0.025, // Adjust the circle size based on screen width
    height: screenWidth * 0.025, // Adjust the circle size based on screen width
    borderRadius: (screenWidth * 0.025) / 2, // Adjust the circle border radius based on screen width
    borderWidth: 1,
    borderColor: BLACK, // Adjust the border color as needed
    marginHorizontal: screenWidth * 0.0125, // Adjust the margin horizontal based on screen width
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledCircle: {
    backgroundColor: BLACK, // Adjust the filled circle color as needed
  },
  circleText: {
    color: BLACK, // Adjust the text color as needed - todo - remove number from circle
    fontSize: screenWidth * 0.025 * 0.6, // Adjust the circle text size based on screen width
  },
  buttonContainer: {
    marginTop: screenHeight * 0.05, // Adjust the margin top based on screen height
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.015, // Adjust the margin bottom based on screen height
  },
  button: {
    width: screenWidth * 0.2, // Adjust the button width based on screen width
    height: screenWidth * 0.2, // Adjust the button height based on screen width
    borderRadius: (screenWidth * 0.2) / 2, // Adjust the button border radius based on screen width
    borderWidth: 1,
    borderColor: BLACK, // Adjust the button border color as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8
  },
  emptyButton: {
    width: screenWidth * 0.2, // Adjust the button width based on screen width
    height: screenWidth * 0.2, // Adjust the button height based on screen width
    borderRadius: (screenWidth * 0.2) / 2, // Adjust the button border radius based on screen width
    borderWidth: 1,
    borderColor: WHITE, // Adjust the button border color as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: BLACK, // Adjust the button text color as needed
    fontSize: screenWidth * 0.2 * 0.3, // Adjust the button text size based on screen width
  },
  rowLast: {
    marginBottom: 0, // No margin bottom for the last row
  },
  buttonLast: {
    backgroundColor: WHITE, // Adjust the button background color as needed
  },
  roundTouchable: {
    width: screenWidth * 0.2, // Adjust the round touchable width based on screen width
    height: screenWidth * 0.2, // Adjust the round touchable height based on screen width
    borderRadius: (screenWidth * 0.2) / 2, // Adjust the round touchable border radius based on screen width
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE, // Adjust the round touchable background color as needed
  },
  roundTouchableIcon: {
    marginTop: screenHeight * 0.015, // Adjust the margin top based on screen height
  },
  });

export default CreatePinScreen;

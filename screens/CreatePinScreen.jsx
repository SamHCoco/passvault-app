import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import AppRoundTouchable from '../components/AppRoundTouchable';

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
      setConfirmPinMode(false);
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

  return (
    <ImageBackground
      source={require('../assets/blue-background.jpeg')}
      style={styles.container}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>{confirmPinMode ? 'Confirm your Pin' : 'Create your Pin'}</Text>
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
            <TouchableOpacity
              style={[styles.button, styles.buttonLast]}
              onPress={() => handlePinPress('0')}
            >
              <Text style={styles.buttonText}>0</Text>
            </TouchableOpacity>
            <AppRoundTouchable
              iconName="backspace"
              iconSize={35}
              iconColor="white"
              iconLibrary="ion"
              onPress={handleDeletePress}
              touchableStyle={styles.roundTouchable}
              iconStyle={styles.roundTouchableIcon}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the overlay opacity as needed
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white', // Adjust the text color as needed
  },
  buttonContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // Increased spacing between rows
  },
  rowLast: {
    marginLeft: 80,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white', // Adjust the border color as needed
  },
  buttonLast: {
    marginBottom: 0,
  },
  buttonText: {
    fontSize: 24,
    color: 'white', // Adjust the text color as needed
  },
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginHorizontal: 5,
  },
  filledCircle: {
    backgroundColor: 'white',
  },
  circleText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  roundTouchable: {
    marginLeft: 20,
  },
  roundTouchableIcon: {
    // Adjust icon styles as needed
  },
});

export default CreatePinScreen;

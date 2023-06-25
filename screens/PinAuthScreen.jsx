import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import AppRoundTouchable from '../components/AppRoundTouchable';

const PinAuthScreen = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [pinEntered, setPinEntered] = useState([]);

  useEffect(() => {
    checkPinExists();
  }, []);

  const checkPinExists = async () => {
    try {
      const credentials = await SecureStore.getItemAsync('passvault-app-pin');
      if (!credentials) {
        // Pin does not exist, navigate to PIN creation screen
        navigation.navigate('CreatePin');
      }
    } catch (error) {
      // Handle error
    }
  };

  const handlePinPress = (number) => {
    const newPin = pin + number;
    setPin(newPin);
    setPinEntered([...pinEntered, number]);

    if (newPin.length === 4) {
      authenticatePin(newPin);
    }
  };

  const handleDeletePress = () => {
    const newPin = pin.slice(0, -1);
    setPin(newPin);
    setPinEntered(pinEntered.slice(0, -1));
  };

  const authenticatePin = async (enteredPin) => {
    try {
      const storedPin = await SecureStore.getItemAsync('passvault-app-pin');
      if (storedPin && storedPin === enteredPin) {
        // Pin authentication successful
        navigation.navigate('Tabs');
      } else {
        // Incorrect pin
        setPin('');
        setPinEntered([]);
        vibrate();
        // Handle incorrect pin logic (e.g., show error message)
      }
    } catch (error) {
      // Handle error
    }
  };

  const vibrate = () => {
    Vibration.vibrate([0, 500]); // Vibrate for 500ms
  };

  return (
    <ImageBackground
      source={require('../assets/blue-background.jpeg')}
      style={styles.container}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>Enter PIN</Text>
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
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white', // Adjust the border color as needed
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledCircle: {
    backgroundColor: 'white', // Adjust the filled circle color as needed
  },
  circleText: {
    color: 'white', // Adjust the text color as needed
    fontSize: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  buttonText: {
    fontSize: 24,
    color: 'white', // Adjust the text color as needed
  },
  roundTouchable: {
    marginLeft: 20,
    marginTop: 25
  },
  roundTouchableIcon: {
    // Adjust icon styles as needed
  },
});

export default PinAuthScreen;

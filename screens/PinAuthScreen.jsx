import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Vibration, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import AppRoundTouchable from '../components/AppRoundTouchable';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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
    width: screenWidth * 0.8, // Adjust the content width as needed (80% of screen width)
  },
  title: {
    fontSize: screenWidth * 0.05, // Adjust the font size based on screen width
    fontWeight: 'bold',
    marginBottom: screenHeight * 0.025, // Adjust the margin bottom based on screen height
    color: 'white', // Adjust the text color as needed
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
    borderColor: 'white', // Adjust the border color as needed
    marginHorizontal: screenWidth * 0.0125, // Adjust the margin horizontal based on screen width
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledCircle: {
    backgroundColor: 'white', // Adjust the filled circle color as needed
  },
  circleText: {
    color: 'white', // Adjust the text color as needed
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
  rowLast: {
    marginLeft: screenWidth * 0.2, // Adjust the margin left based on screen width
  },
  button: {
    width: screenWidth * 0.2, // Adjust the button width based on screen width
    height: screenWidth * 0.2, // Adjust the button height based on screen width
    borderRadius: (screenWidth * 0.2) / 2, // Adjust the button border radius based on screen width
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white', // Adjust the border color as needed
  },
  buttonText: {
    fontSize: screenWidth * 0.2 * 0.6, // Adjust the button text size based on screen width
    color: 'white', // Adjust the text color as needed
  },
  roundTouchable: {
    marginLeft: screenWidth * 0.05, // Adjust the margin left based on screen width
    marginTop: screenHeight * 0.03, // Adjust the margin top based on screen height
  },
  roundTouchableIcon: {
    // Adjust icon styles as needed
  },
});


export default PinAuthScreen;

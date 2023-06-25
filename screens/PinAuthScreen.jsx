import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import * as SecureStore from 'expo-secure-store';

const PinAuthScreen = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');

  useEffect(() => {
    checkPinExists();
  }, []);

  const checkPinExists = async () => {
    try {
      console.log("PIN AUTH SCREEN - Check Pin Exists Triggered"); // todo - remove
      const credentials = await SecureStore.getItemAsync('passvault-app-pin');
      console.log("PIN AUTH SCREEN - credentials value: ", credentials); // todo - remove
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

    if (newPin.length === 4) {
      authenticatePin(newPin);
    }
  };

  const authenticatePin = async (enteredPin) => {
    try {
      const credentials = await SecureStore.getItemAsync('passvault-app-pin');
      if (credentials && credentials.password === enteredPin) {
        // Pin authentication successful
        navigation.navigate('Tabs');
      } else {
        // Incorrect pin
        setPin('');
        // Handle incorrect pin logic (e.g., show error message)
      }
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
        <Text style={styles.title}>Enter PIN</Text>
        <View style={styles.pinContainer}>
          <Text style={styles.pin}>{pin}</Text>
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
  pinContainer: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: 'white', // Adjust the border color as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pin: {
    fontSize: 18,
    color: 'white', // Adjust the text color as needed
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
  buttonLast: {
    marginBottom: 0,
  },
  buttonText: {
    fontSize: 24,
    color: 'white', // Adjust the text color as needed
  },
});

export default PinAuthScreen;

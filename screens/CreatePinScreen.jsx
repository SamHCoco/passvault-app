import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';

const CreatePinScreen = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');

  const handlePinPress = (number) => {
    const newPin = pin + number;
    setPin(newPin);

    if (newPin.length === 4) {
      storePin(newPin);
    }
  };

  const storePin = async (newPin) => {
    try {
      await Keychain.setGenericPassword('passvault-app-pin', newPin);
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
        <Text style={styles.title}>Create your Pin</Text>
        <View style={styles.pinContainer}>
          <Text style={styles.pin}>{pin}</Text>
        </View>
        <View style={styles.buttonContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
            <TouchableOpacity
              key={number}
              style={styles.button}
              onPress={() => handlePinPress(number.toString())}
            >
              <Text style={styles.buttonText}>{number}</Text>
            </TouchableOpacity>
          ))}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white', // Adjust the border color as needed
    margin: 10,
  },
  buttonText: {
    fontSize: 24,
    color: 'white', // Adjust the text color as needed
  },
});

export default CreatePinScreen;

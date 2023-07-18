import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Switch, Alert, Dimensions } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

import { BIO_AUTH_ENABLED } from '../service/constants';
import AppIcon from '../components/AppIcon';
import { BLACK, LIGHT_GREEN, LIGHT_GREY, WHITE } from '../constants/colors';
import AppAlert from '../components/AppAlert';

const { width: screenWidth} = Dimensions.get('window');

const SettingsScreen = () => {
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false); // State for biometric authentication

  useEffect(() => {
    const loadBioAuthSetting = async () => {
      try {
        const bioAuthEnabled = await SecureStore.getItemAsync(BIO_AUTH_ENABLED);
        if (bioAuthEnabled === 'true') {
          setBiometricEnabled(true); // Enable biometric authentication if BIO_AUTH_ENABLED is true
        }
      } catch (error) {
        console.log('Error reading bioAuthEnabled from SecureStore:', error);
      }
    };

    loadBioAuthSetting();
  }, []);

  const handleOpenShowInfoAlert = () => {
    setShowInfoAlert(true);
  };

  const handleCloseShowInfoAlert = () => {
    setShowInfoAlert(false);
  };

  const handleBiometricToggle = async (value) => {
    try {
      if (value) {
        const hasBiometricAuth = await LocalAuthentication.hasHardwareAsync();
        if (hasBiometricAuth) {
          const biometricRecords = await LocalAuthentication.isEnrolledAsync();
          if (biometricRecords) {
            setBiometricEnabled(true);
            await SecureStore.setItemAsync(BIO_AUTH_ENABLED, 'true');
          } else {
            Alert.alert('No biometric records found.');
          }
        } else {
          Alert.alert('Biometric authentication not supported by this device.');
        }
      } else {
        setBiometricEnabled(false);
        await SecureStore.setItemAsync(BIO_AUTH_ENABLED, 'false');
      }
    } catch (error) {
      console.log('Error checking biometric availability:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <AppIcon name="cog-outline" size={95} color={LIGHT_GREEN} />
      </View>
      <Section title="Security" biometricEnabled={biometricEnabled} handleBiometricToggle={handleBiometricToggle} />
      <Section title="Info">
        <Option title="About" onPress={handleOpenShowInfoAlert} />
      </Section>

      <AppAlert visible={showInfoAlert} onClose={handleCloseShowInfoAlert}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../assets/passvault-icon-final.png')} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Version:     1.0.0</Text>
        </View>
      </AppAlert>
    </View>
  );
};

const Section = ({ title, children, biometricEnabled, handleBiometricToggle }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
      {title === 'Security' && (
        <View style={styles.optionContainer}>
          <TouchableOpacity onPress={() => handleBiometricToggle(!biometricEnabled)} style={styles.biometricToggle}>
            <Text style={styles.optionTitle}>Enable Biometric Auth</Text>
            <Switch
              value={biometricEnabled}
              onValueChange={(value) => handleBiometricToggle(value)}
              trackColor={{ false: LIGHT_GREY, true: LIGHT_GREEN }}
              thumbColor={biometricEnabled ? WHITE : WHITE}
              style={styles.switch}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const Option = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.optionContainer} onPress={onPress}>
      <Text style={styles.optionTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.0388,
    paddingTop: screenWidth * 0.0777,
    backgroundColor: WHITE,
  },
  sectionContainer: {
    marginBottom: screenWidth * 0.0584,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.0438,
    fontWeight: 'bold',
    marginBottom: screenWidth * 0.0388,
  },
  optionContainer: {
    backgroundColor: WHITE,
    borderRadius: screenWidth * 0.0194,
    borderBottomWidth: screenWidth * 0.0024,
    borderColor: LIGHT_GREY,
    padding: screenWidth * 0.0388,
    marginBottom: screenWidth * 0.0194,
  },
  optionTitle: {
    fontSize: screenWidth * 0.0388,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: screenWidth * 0.0388,
  },
  logo: {
    width: screenWidth * 0.2430,
    height: screenWidth * 0.2430,
    resizeMode: 'contain',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: screenWidth * 0.0388,
  },
  titleText: {
    fontSize: screenWidth * 0.0511,
    color: BLACK,
  },
  biometricToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Adjust the scale as needed
  },
});

export default SettingsScreen;

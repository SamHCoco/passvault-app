import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as LocalAuthentication from 'expo-local-authentication';
import 'expo-dev-client';
import mobileAds from 'react-native-google-mobile-ads';

import PinAuthScreen from './screens/PinAuthScreen';
import CreatePinScreen from './screens/CreatePinScreen';
import VaultScreen from './screens/VaultScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditWebCredentialScreen from './screens/EditWebCredentialScreen';
import createTables from './service/createTable';
import AppIcon from './components/AppIcon';

import { BLACK, LIGHT_GREEN, WHITE } from './constants/colors';
import generateRandomPassword from './service/generatePassword';
import * as SecureStore from 'expo-secure-store';
import { PASSVAULT_KEY } from './service/constants';
import { BIO_AUTH_ENABLED } from './service/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const SCREEN_HEIGHT = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// SplashScreen component
const SplashScreen = ({ navigation }) => {
  const logoAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
    generateMasterKey();
    const timer = setTimeout(() => {
      checkBiometricEnabled();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [masterKey256BitConfiguration, setMasterKey256BitConfiguration] = useState({
    length: 32,
    includeLowerCase: true,
    includeNumbers: true,
    includeSpecialChars: true,
    includeUpperCase: true});
  
  const generateMasterKey = async () => {
    const passvaultKey = await SecureStore.getItemAsync(PASSVAULT_KEY);
    if (!passvaultKey) {
      await SecureStore.setItemAsync(PASSVAULT_KEY, generateRandomPassword(masterKey256BitConfiguration));
    }
  }

  const checkBiometricEnabled = async () => {
    try {
      const bioAuthEnabled = await SecureStore.getItemAsync(BIO_AUTH_ENABLED);
      if (bioAuthEnabled === 'true') {
        const hasBiometricAuth = await LocalAuthentication.hasHardwareAsync();
        if (hasBiometricAuth) {
          const biometricRecords = await LocalAuthentication.isEnrolledAsync();
          if (biometricRecords) {
            const result = await LocalAuthentication.authenticateAsync();
            if (result.success) {
              navigation.replace('Tabs');
            }
          }
        }
      } else {
        checkPinExists();
      }
    } catch (error) {
      console.log('Error checking biometric authentication:', error);
      checkPinExists();
    }
  };

  const checkPinExists = async () => {
    try {
      const credentials = await SecureStore.getItemAsync('passvault-app-pin');
      if (credentials) {
        navigation.navigate('AppPinAuth');
      } else {
        navigation.navigate('CreatePin'); // Pin does not exist, navigate to PIN creation screen
      }
    } catch (error) {
      // Handle error
    }
  };

  const startAnimation = () => {
    Animated.timing(logoAnimation, {
      toValue: 0.25,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const logoTranslateY = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0.25 * SCREEN_HEIGHT],
  });

  return (
    <View style={styles.logoContainer}>
      <Animated.View style={[styles.logo, { transform: [{ translateY: logoTranslateY }] }]}>
        <Image source={require('./assets/passvault-icon-final.png')} style={styles.logoImage} />
      </Animated.View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>PassVault</Text>
      </View>
    </View>
  );
};

function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Vault') {
            iconName = focused ? 'safe-square' : 'safe-square-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <AppIcon name={iconName} size={screenWidth * 0.05839} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: LIGHT_GREEN,
        inactiveTintColor: BLACK,
        labelStyle: {
          fontSize: screenWidth * 0.03406,
        },
      }}
    >
      <Tab.Screen name="Vault" component={VaultScreen} options={tabScreen.options} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={tabScreen.options} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    createTables();
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete!
  });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" headerMode="none">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="AppPinAuth" component={PinAuthScreen} />
        <Stack.Screen name="CreatePin" component={CreatePinScreen} />
        <Stack.Screen name="Tabs" component={TabScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Credential" component={EditWebCredentialScreen} />
        <Stack.Screen name="Vault" component={VaultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const tabScreen = {
  options: {
    headerTitleAlign: 'center'
  },
  
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  logo: {
    width: screenWidth * 0.24331,
    height: screenWidth * 0.36496,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  titleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 0.25 * SCREEN_HEIGHT + 10
  },
  title: {
    fontSize: screenWidth * 0.08759,
    fontWeight: 'bold',
    marginTop: screenWidth * 0.024331,
    color: LIGHT_GREEN,
    fontFamily: 'Roboto'
  },
});

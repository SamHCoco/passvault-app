import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PinAuthScreen from './screens/PinAuthScreen';
import CreatePinScreen from './screens/CreatePinScreen';
import VaultScreen from './screens/VaultScreen';
import BackupScreen from './screens/BackupScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditWebCredentialScreen from './screens/EditWebCredentialScreen';
import createTables from './service/createTable';
import AppIcon from './components/AppIcon';

import * as SecureStore from 'expo-secure-store';

import { BLACK, LIGHT_GREEN, WHITE } from './constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const SCREEN_HEIGHT = Dimensions.get('window').height;

// SplashScreen component
const SplashScreen = ({ navigation }) => {
  const logoAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
    const timer = setTimeout(() => {
      checkPinExists();
      // navigation.replace('AppPinAuth');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);


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
      duration: 2500,
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
        <Image source={require('/Users/euler/repos/passvault-app/assets/passvault-icon-v2-edit.png')} style={styles.logoImage} />
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
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'Backup') {
            iconName = focused ? 'file-restore': 'file-restore-outline';
          }

          return <AppIcon name={iconName} size={30} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: LIGHT_GREEN,
        inactiveTintColor: BLACK,
        labelStyle: {
          fontSize: 14,
        },
      }}
    >
      <Tab.Screen name="Vault" component={VaultScreen} options={tabScreen.options} />
      <Tab.Screen name="Backup" component={BackupScreen} options={tabScreen.options} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={tabScreen.options} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    createTables();
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
  }
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
  },
  logo: {
    width: 100,
    height: 150,
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
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 10,
    color: LIGHT_GREEN,
    fontFamily: 'Roboto'
  },
});

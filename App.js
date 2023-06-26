import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PinAuthScreen from './screens/PinAuthScreen';
import CreatePinScreen from './screens/CreatePinScreen';
import VaultScreen from './screens/VaultScreen';
import BackupScreen from './screens/BackupScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditWebCredentialScreen from './screens/EditWebCredentialScreen';
import createTables from './service/createTable';
import AppIcon from './components/AppIcon';

import { BLACK, LIGHT_GREEN } from './constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// SplashScreen component
const SplashScreen = ({ navigation }) => {
  const logoAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
    // Simulating a delay before navigating to the AppPinAuth screen
    const timer = setTimeout(() => {
      navigation.replace('AppPinAuth');
    }, 3000);

    return () => clearTimeout(timer); // Clean up the timer when the component unmounts
  }, []);

  const startAnimation = () => {
    Animated.timing(logoAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('/Users/euler/repos/passvault-app/assets/blue-background.jpeg')}
    >
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logo,
            {
              transform: [
                {
                  translateY: logoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-200, 0], // Slide the logo from top to center
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require('/Users/euler/repos/passvault-app/assets/logo-icon-2.png')}
            style={styles.logoImage}
          />
        </Animated.View>
      </View>
    </ImageBackground>
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

          return <AppIcon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: LIGHT_GREEN,
        inactiveTintColor: BLACK,
      }}
    >
      <Tab.Screen name="Vault" component={VaultScreen} />
      <Tab.Screen name="Backup" component={BackupScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

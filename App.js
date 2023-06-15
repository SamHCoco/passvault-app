import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { View, TextInput } from 'react-native';

import VaultScreen from './screens/VaultScreen';
import BackupScreen from './screens/BackupScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// const SearchBar = () => {
//   return (
//     <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
//       <TextInput
//         style={{
//           borderWidth: 1,
//           borderColor: 'gray',
//           borderRadius: 8,
//           paddingVertical: 8,
//           paddingHorizontal: 12,
//         }}
//         placeholder="Search"
//       />
//     </View>
//   );
// };


export default function App() {
  return (
    <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Vault') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Backup') {
            iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        "tabBarActiveTintColor": "blue",
          "tabBarInactiveTintColor": "gray",
          "tabBarStyle": [
            {
              "display": "flex"
            },
            null
          ]
      })}
      // tabBarOptions={{
      //   activeTintColor: 'blue',
      //   inactiveTintColor: 'gray'
      // }}
    >
      <Tab.Screen name="Vault" component={VaultScreen} />
      <Tab.Screen name="Backup" component={BackupScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  </NavigationContainer>
  );
}

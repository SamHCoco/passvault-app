import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { View, TextInput, StyleSheet } from 'react-native';

import * as SQLite from 'expo-sqlite';

import VaultScreen from './screens/VaultScreen';
import BackupScreen from './screens/BackupScreen';
import SettingsScreen from './screens/SettingsScreen';

import AppIcon from './components/AppIcon';

const Tab = createBottomTabNavigator();

const db = SQLite.openDatabase({ name: 'passvault.db', location: 'default' });

export default function App() {
  const [webCredentialCount, setWebCredentialCount] = useState(0);
  const [cardCredentialCount, setCardCredentialCount] = useState(0);


  useEffect(() => {
    const createTables = () => {
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS web (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)',
          [],
          (_, result) => {
            console.log('Web table created successfully');
          },
          (_, error) => {
            console.log('Error creating web table:', error);
          }
        );

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS card (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)',
          [],
          (_, result) => {
            console.log('Card table created successfully');
          },
          (_, error) => {
            console.log('Error creating card table:', error);
          }
        );

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS web_credential (id INTEGER PRIMARY KEY AUTOINCREMENT, web_id INTEGER NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL, FOREIGN KEY (web_id) REFERENCES web(id))',
          [],
          (_, result) => {
            console.log('Web Credential table created successfully');
          },
          (_, error) => {
            console.log('Error creating web_credential table:', error);
          }
        );

        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS card_credential (id INTEGER PRIMARY KEY AUTOINCREMENT, card_id INTEGER NOT NULL, card_number TEXT NOT NULL, exp_date TEXT NOT NULL, security_code INTEGER, FOREIGN KEY (card_id) REFERENCES card(id))',
          [],
          (_, result) => {
            console.log('Card Credential table created successfully');
          },
          (_, error) => {
            console.log('Error creating card_credential table:', error);
          }
        );
      });
    };

    createTables(); 
  }, []);

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
                <AppIcon
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            }
          })}
          tabBarOptions={{
            activeTintColor: 'dodgerblue',
            inactiveTintColor: 'grey'
          }}
          >
          <Tab.Screen name="Vault" component={VaultScreen} />
          <Tab.Screen name="Backup" component={BackupScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
  );
}

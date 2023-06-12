import React, { useState, useEffect } from 'react';
import { Text, FlatList, View } from 'react-native';
import Screen from '../components/Screen';
import AppTile from '../components/AppTile';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("passvault.db");


function VaultScreen(props) {
    const [webCredentials, setWebCredentials] = useState([]);

    useEffect(() => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM credentials',
          [],
          (_, { rows }) => {
            const credentialsList = rows._array;
            setWebCredentials(credentialsList);
          },
          error => {
            console.log('Error retrieving credentials:', error);
          }
        );
      });
    }, []);

    const data = [
        {
            id: 1,
            username: 'john.smith@email.co.uk',
            password: 'password1'
        },
        {
            id: 2,
            username: 'ella.star@email.co.uk',
            password: 'password2'
        }
    ];

    return (
           <Screen>
                <Text>Web Credentials:</Text>
                { webCredentials.map(credential => (
                  <AppTile key={credential.id} data={credential} />
                  ))
                }
           </Screen>
        
    );
}

export default VaultScreen;
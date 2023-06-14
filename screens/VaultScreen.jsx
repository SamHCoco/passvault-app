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

    const Devdata = [
        {
            id: 1,
            username: 'john.smith@email.co.uk',
            password: 'password1'
        },
        {
            id: 2,
            username: 'ella.star@email.co.uk',
            password: 'password2'
        },
        {
          id: 3,
          username: 'scarlet.wandsworth@email.co.uk',
          password: 'password3'
        },
        {
          id: 4,
          username: 'brandon.wilkes@email.co.uk',
          password: 'password4'
        }
    ];

    const renderItem = ({ data }) => (
      <AppTile data={data} />
    );

    return (
           <Screen>
                <Text>Web Credentials:</Text>
                <FlatList 
                  data={Devdata}
                  renderItem={ ({ item }) => (
                      <AppTile data={item} />
                  )}
                  keyExtractor={(item) => item.id}
                />
           </Screen>
        
    );
}

export default VaultScreen;
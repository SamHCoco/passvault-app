import React, { useState, useEffect } from 'react';
import { Text, FlatList } from 'react-native';
import Screen from '../components/Screen';
import AppTile from '../components/AppTile';

import { getWebCredentials } from '../service/sqlservice';

import { openDatabase } from 'expo-sqlite';

const db = openDatabase({
    name: "passvault_db"
  });


function VaultScreen(props) {
    const [webCredentials, setWebCredentials] = useState([]);

    useEffect(() => {
        getWebCredentialsList();
      }, []);

      const getWebCredentialsList = () => {
        getWebCredentials(
          credentials => {
            setWebCredentials(credentials);
            console.log("Credentials successfully called: " + webCredentials);
          },
          error => {
            console.error('Failed to retrieve web credentials:', error);
          }
        );
      };

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
                <Text>Web Credential List:</Text>
                <FlatList
                    data={webCredentials}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                    <View>
                        <Text>{`Username: ${item.username}`}</Text>
                        <Text>{`Password: ${item.password}`}</Text>
                        <Text>{`URL: ${item.url}`}</Text>
                    </View>
                    )}
                />
           </Screen>
        
    );
}

export default VaultScreen;
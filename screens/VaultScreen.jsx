import React, { useState, useEffect } from 'react';
import { Text, FlatList, View } from 'react-native';
import Screen from '../components/Screen';
import AppCredentialProvider from '../components/AppCredentialProvider';
import AppCredentialMetric from '../components/AppCredentialMetric';

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


    const credentialProviders = [
      {
        id: 1,
        name : "Facebook",
        image: require("../assets/icon.png"),
      },
      {
        id: 2,
        name : "YouTube",
        image: require("../assets/icon.png"),
      }
    ];



    return (
           <Screen>
                <View style={ {flexDirection: "row"}}>
                <AppCredentialMetric
                  image={require('../assets/icon.png')}
                  text="Web"
                  subText="5"
                />
                <AppCredentialMetric
                  image={require('../assets/icon.png')}
                  text="Card"
                  subText="3"
                />
                </View>
                <Text>Credential Providers</Text>
                <FlatList 
                  data={credentialProviders}
                  renderItem={ ({ item }) => (
                      <AppCredentialProvider provider={item} />
                  )}
                  keyExtractor={(item) => item.id}
                />
           </Screen>
        
    );
}

export default VaultScreen;
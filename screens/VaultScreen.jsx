import React, { useState, useEffect} from 'react';
import { Text, FlatList, View } from 'react-native';
import Screen from '../components/Screen';
import AppCredentialProvider from '../components/AppCredentialProvider';
import AppCredentialMetric from '../components/AppCredentialMetric';
import AppSearchBar from '../components/AppSearchBar';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('passvault.db');

function VaultScreen(props) {
  const [web, setWeb] = useState([]);
  const [card, setCard] = useState([]);
  const [credentialProviders, setCredentialProviders] = useState([]);
  
  const [webCredentialCount, setWebCredentialCount] = useState(0);
  const [cardCredentialCount, setCardCredentialCount] = useState(0);

  const fetchRecords = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id, name FROM web',
        [],
        (_, { rows }) => {
          const webRecords = rows._array;
          setWeb(webRecords);
          console.log('Returned Web Records:', webRecords);
          updateCredentialProviders();
        },
        (error) => {
          console.log('Error retrieving web records:', error);
        }
      );

      tx.executeSql(
        'SELECT id, name FROM card',
        [],
        (_, { rows }) => {
          const cardRecords = rows._array;
          setCard(cardRecords);
          updateCredentialProviders();
        },
        (error) => {
          console.log('Error retrieving card records:', error);
        }
      );
    });
  };

  const countCredentials = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) AS webCount FROM web_credential',
        [],
        (_, result) => {
          const count = result.rows.item(0).webCount;
          setWebCredentialCount(count);
        },
        (_, error) => {
          console.log('Error retrieving web credential count:', error);
        }
      );
  
      tx.executeSql(
        'SELECT COUNT(*) AS cardCount FROM card_credential',
        [],
        (_, result) => {
          const count = result.rows.item(0).cardCount;
          setCardCredentialCount(count);
        },
        (_, error) => {
          console.log('Error retrieving card credential count:', error);
        }
      );
    });
  };

  useEffect(() => {
    fetchRecords();
    countCredentials();
  }, []);

  const updateCredentialProviders = () => {
    const providers = [
      ...web.map((record) => ({
        id: record.id,
        name: record.name,
        image: require('../assets/icon.png'),
        type: "web"
      })),
      ...card.map((record) => ({
        id: record.id,
        name: record.name,
        image: require('../assets/icon.png'),
        type: "card"
      })),
    ];
    setCredentialProviders(providers);
  };

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <AppCredentialMetric
          image={require('../assets/icon.png')}
          text="Web"
          subText={webCredentialCount}
        />
        <AppCredentialMetric
          image={require('../assets/icon.png')}
          text="Card"
          subText={cardCredentialCount}
        />
        <AppCredentialMetric
          image={require('../assets/icon.png')}
          text="Cust."
          subText="1"
        />
      </View>

      <AppSearchBar />

      <FlatList
        data={credentialProviders}
        renderItem={({ item }) => <AppCredentialProvider provider={item} />}
        keyExtractor={(item) => item.type + item.id.toString()}
      />
    </Screen>
  );
}

export default VaultScreen;

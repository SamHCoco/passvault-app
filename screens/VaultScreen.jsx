import React, { useState, useEffect } from 'react';
import { Text, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
// import { SwipeListView } from 'react-native-swipe-list-view';
import Screen from '../components/Screen';
import AppCredentialMetric from '../components/AppCredentialMetric';
import AppSearchBar from '../components/AppSearchBar';
import AppRoundTouchable from '../components/AppRoundTouchable';
import AppWebCredential from '../components/AppWebCredential';
import AppCredentialProvider from '../components/AppCredentialProvider';
import { useNavigation } from '@react-navigation/native'; 

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('passvault.db');

function VaultScreen(props) {
  const [web, setWeb] = useState([]);
  const [card, setCard] = useState([]);
  const [credentialProviders, setCredentialProviders] = useState([]);

  const [webCredentialCount, setWebCredentialCount] = useState(0);
  const [cardCredentialCount, setCardCredentialCount] = useState(0);

  const navigation = useNavigation();

  const webCredData = [
    { id: 1, username: 'john_doe', password: 'password123' },
    { id: 2, username: 'jane_smith', password: 'secret456' },
    // Add more data entries as needed
  ];

  const updateCredentialProviders = () => {
    const providers = [
      ...web.map((record) => ({
        id: record.id,
        name: record.name,
        image: require('../assets/icon.png'),
        type: 'web',
      })),
      ...card.map((record) => ({
        id: record.id,
        name: record.name,
        image: require('../assets/icon.png'),
        type: 'card',
      }))
    ];
    setCredentialProviders(providers);
  };

  const renderWebCredentialItem = ({ item }) => {
    const { username, password } = item;
    return <AppWebCredential username={username} password={password} />;
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={styles.editButton} onPress={() => console.log('Edit pressed')}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => console.log('Delete pressed')}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const fetchRecords = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id, name FROM web',
        [],
        (_, { rows }) => {
          const webRecords = rows._array;
          setWeb(webRecords);
          const providers = webRecords.map((record) => ({
            id: record.id,
            name: record.name,
            image: require('../assets/icon.png'),
            type: 'web',
          }));

          setCredentialProviders(providers);
          console.log('Returned Web Records:', webRecords);
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
          console.log('Error retrieving web credential count: ', error);
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
    fetchRecords();
  }, []);

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        <View
          style={{
            borderColor: 'black',
            borderWidth: 1,
            flexDirection: 'row',
            borderRadius: 25,
            width: 255,
            marginLeft: 4,
          }}
        >
          <AppCredentialMetric
            iconName={'web'}
            iconColor={'black'}
            iconLibrary={'material'}
            iconSize={45}
            text="Web"
            subText={webCredentialCount}
          />
          <AppCredentialMetric
            iconName={'card'}
            iconColor={'black'}
            iconLibrary={'ion'}
            iconSize={45}
            text="Card"
            subText={cardCredentialCount}
          />
        </View>

        <AppRoundTouchable iconName={'plus'} 
                           iconColor={'black'} 
                           iconSize={75} 
                           iconLibrary={'material'}
                           onPress={() => navigation.navigate('EditWebCredentialScreen')} />
      </View>
      <AppSearchBar />
      <FlatList
        data={credentialProviders}
        renderItem={({ item }) => <AppCredentialProvider provider={item} />}
        keyExtractor={(item) => item.type + item.id.toString()}
      />
      {/* <SwipeListView
        data={webCredData}
        renderItem={renderWebCredentialItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-80}
        keyExtractor={(item) => item.id.toString()}
      /> */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 2,
    paddingHorizontal: 5,
  },
});

export default VaultScreen;

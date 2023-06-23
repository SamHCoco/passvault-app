import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView }  from 'react-native-swipe-list-view';
import { useNavigation } from '@react-navigation/native';

import AppWebCredential from './AppWebCredential';
import AppCardCredential from './AppCardCredential';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('passvault.db');

const AppCredentialProvider = ({ provider }) => {
  const navigation = useNavigation();

  const [id, setId] = useState(provider.id);
  const [type, setType] = useState(provider.type);
  const [credentials, setCredentials] = useState([]);
  const [showList, setShowList] = useState(false);

  const fetchData = () => {
    const show = !showList;
    if (show) {
      db.transaction((tx) => {
        if (type === 'web') {
          tx.executeSql(
            'SELECT wc.id, wc.username, wc.password, wc.web_url_id, wu.url, "web" AS type FROM web_credential AS wc INNER JOIN web_url AS wu ON wc.web_url_id = wu.id WHERE wc.web_id = ?',
            [id],
            (_, { rows }) => {
              const webCredentialRecords = rows._array;
              setCredentials(webCredentialRecords);
              console.log('FOUND WEB_CREDENTIALS:', webCredentialRecords);
            },
            (error) => {
              console.log('Error retrieving web credential records:', error);
            }
          );
        } else if (type === 'card') {
          tx.executeSql(
            'SELECT id, card_number, exp_date, security_code, card_id, "card" AS type FROM card_credential',
            [],
            (_, { rows }) => {
              const cardCredentialRecords = rows._array;
              setCredentials(cardCredentialRecords);
              console.log('FOUND CARD_CREDENTIALS:', cardCredentialRecords);
            },
            (error) => {
              console.log('Error retrieving card credential records:', error);
            }
          );
        }
      });
    }
    setShowList(show);
  };

  const closeList = () => {
    setShowList(false);
  };

  const renderItem = ({ item }) => {
    console.log("RENDER ITEM - AppCredentialProvider: ", item);
      const { username, password, bank, cardNumber, expDate, securityCode } = item;
      if (item.type === 'web') {
        return <AppWebCredential username={username} password={password} />;
      } else if (item.type === 'card') {
        return (
          <AppCardCredential
            bank={bank}
            cardNumber={cardNumber}
            expDate={expDate}
            securityCode={securityCode}
          />
        );
      }
      return <Text>Error</Text> ; // Default case, can be handled as per your requirements
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditPress(data)}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => console.log('Delete pressed')}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleEditPress = (data) => {
    const {item } = data;
    item.username ? item.type = 'web' : item.type = 'card';
    navigation.navigate('EditWebCredentialScreen', {
        item: item
     });
  };

  return (
    <View>
      <TouchableOpacity onPress={fetchData}>
        <View style={styles.container}>
          <Image source={provider.image} style={styles.image} />
          <Text style={styles.label}>{provider.name}</Text>
        </View>
      </TouchableOpacity>
      {showList && (
        <SwipeListView
          data={credentials}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-100}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 4,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  label: {
    fontSize: 12,
    color: 'black',
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'gray',
    marginHorizontal: 10
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: '100%',
    backgroundColor: 'dodgerblue',
    alignSelf: 'flex-end'
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: '100%',
    backgroundColor: 'red',
    alignSelf: 'flex-end'
  }
});

export default AppCredentialProvider;
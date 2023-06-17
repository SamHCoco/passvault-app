import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView }  from 'react-native-swipe-list-view';
import AppWebCredential from './AppWebCredential';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('passvault.db');

const AppCredentialProvider = ({ provider }) => {
  const [id, setId] = useState(provider.id);
  const [type, setType] = useState(provider.type);
  const [credentials, setCredentials] = useState([]);
  const [showList, setShowList] = useState(false);

  const fetchData = () => {
    db.transaction((tx) => {
        if (type === 'web') {
            tx.executeSql(
                'SELECT id, username, password FROM web_credential WHERE web_id = ?',
                [id],
                (_, { rows }) => {
                  const webCredentialRecords = rows._array;
                  setCredentials(webCredentialRecords);
                  setShowList(true);
                  console.log('FOUND WEB_CREDENTIALS: ', webCredentialRecords);
                },
                (error) => {
                  console.log('Error retrieving web credential records:', error);
                }
              );
        }
    });
  };

  const closeList = () => {
    setShowList(false);
  };

  const renderItem = ({ item }) => {
    const { username, password } = item;
    return <AppWebCredential username={username} password={password} />;
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
          onRowDidOpen={closeList}
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
});

export default AppCredentialProvider;
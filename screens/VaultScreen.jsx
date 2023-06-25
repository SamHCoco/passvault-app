import React, { useState, useEffect } from 'react';
import { Text, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/Screen';
import AppCredentialMetric from '../components/AppCredentialMetric';
import AppSearchBar from '../components/AppSearchBar';
import AppRoundTouchable from '../components/AppRoundTouchable';
import AppWebCredential from '../components/AppWebCredential';
import AppCredentialProvider from '../components/AppCredentialProvider';
import search from '../service/search';

import { WHITE, LIGHT_GREY } from '../constants/colors';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('passvault.db');

function VaultScreen({ route }) {
  const [web, setWeb] = useState([]);
  const [card, setCard] = useState([]);
  const [credentialProviders, setCredentialProviders] = useState([]);
  const [webCredentialCount, setWebCredentialCount] = useState(0);
  const [cardCredentialCount, setCardCredentialCount] = useState(0);
  const [deleteActionFlag, setDeleteActionFlag] = useState(false);
  const [selected, setSelected] = useState('web'); // New 'selected' state with default value 'web'
  const [searchText, setSearchText] = useState('');

  const navigation = useNavigation();

  /**
   * Search bar handler
   */
  const handleSearch = (searchText) => {
    console.log('handleSearch invoked: ', searchText);
    const tableName = selected === 'web' ? 'web' : 'card';
    const columnName = 'name';

    // Perform a SELECT LIKE query against the selected table and column
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableName} WHERE ${columnName} LIKE '%${searchText}%'`,
        [],
        (_, { rows }) => {
          const records = rows._array;
          console.log('FOUND SEARCH RESULTS: ', records);
          setCredentialProviders(
            records.map((record) => ({
              id: record.id,
              name: record.name,
              image: require('../assets/icon.png'),
              type: tableName,
            }))
          );
        },
        (error) => {
          console.log(`Error searching ${tableName}:`, error);
        }
      );
    });
  };

  const handleSearchTextChange = (text) => {
    handleSearch(text);
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
    console.log("VAULT SCREEN - useEffect Triggered - ROUTE: ", route); // todo - remove
    if (route && route.params) {
      const { selectedOption } = route.params;
      setSelected(selectedOption ? selectedOption : 'web'); // Set 'selected' state based on 'selectedOption'
      fetchRecordsFromTable(selectedOption ? selectedOption : 'web');
    } else {
      fetchRecordsFromTable('web');
    }
    countCredentials();
  }, [deleteActionFlag, searchText, route]);

  const handleAppCredentialMetricPress = (type) => {
    setSelected(type); // Update 'selected' state
    fetchRecordsFromTable(type);
  };

  const fetchRecordsFromTable = (tableName) => {
    console.log("Fetch Records from Table trigger for table: ", tableName); // todo - remove
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableName}`,
        [],
        (_, { rows }) => {
          const records = rows._array;
          console.log("Fetched Credential - table ", tableName, records);
          setCredentialProviders(
            records.map((record) => ({
              id: record.id,
              name: capitalizeFirstLetter(record.name),
              image: require('../assets/icon.png'),
              type: tableName,
            }))
          );
        },
        (error) => {
          console.log(`Error retrieving ${tableName} records:`, error);
        }
      );
    });
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleDeleteAction = () => {
    // Toggle the flag to trigger a re-render of the VaultScreen component
    console.log("Handle Delete Item triggered"); // todo - remove
    setDeleteActionFlag(!deleteActionFlag);
  };

  const renderItemFlatList = ({ item }) => {
    return <AppCredentialProvider provider={item} onDeleteAction={handleDeleteAction} />;
  };

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: WHITE,
        }}
      >
        <View
          style={{
            borderColor: 'lightgrey',
            borderWidth: 1,
            flexDirection: 'row',
            borderRadius: 25,
            width: 255,
            marginLeft: 4,
          }}
        >
          <AppCredentialMetric
            iconName={'web'}
            iconColor={selected === 'web' ? 'lightgreen' : LIGHT_GREY} // Check if selected is 'web' to set icon color
            iconLibrary={'material'}
            iconSize={45}
            text="Web"
            subText={webCredentialCount}
            onPress={() => handleAppCredentialMetricPress('web')}
          />
          <AppCredentialMetric
            iconName={'card'}
            iconColor={selected === 'card' ? 'lightgreen' : 'dodgerblue'} // Check if selected is 'card' to set icon color
            iconLibrary={'ion'}
            iconSize={45}
            text="Card"
            subText={cardCredentialCount}
            onPress={() => handleAppCredentialMetricPress('card')}
          />
        </View>

        <AppRoundTouchable
          iconName={'plus'}
          iconColor={'dodgerblue'}
          iconSize={70}
          iconLibrary={'material'}
          onPress={() => navigation.navigate('Credential')}
        />
      </View>
      <AppSearchBar onSearch={(searchText) => handleSearchTextChange(searchText)} />
      <FlatList
        data={credentialProviders}
        renderItem={renderItemFlatList}
        keyExtractor={(item) => item.type + item.id.toString()}
      />
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

export default VaultScreen

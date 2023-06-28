import React, { useState, useEffect } from 'react';
import { Text, FlatList, View, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AppCredentialMetric from '../components/AppCredentialMetric';
import AppSearchBar from '../components/AppSearchBar';
import AppRoundTouchable from '../components/AppRoundTouchable';
import AppWebCredential from '../components/AppWebCredential';
import AppCredentialProvider from '../components/AppCredentialProvider';
import search from '../service/search';

import capitalizeFirstLetter from '../service/stringUtil';

import { WHITE, LIGHT_GREY, BLACK, LIGHT_GREEN } from '../constants/colors';

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('passvault.db');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const metricButtonWidth = screenWidth * 0.3;

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
              name: capitalizeFirstLetter(record.name),
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

  const handleDeleteAction = () => {
    // Toggle the flag to trigger a re-render of the VaultScreen component
    console.log("Handle Delete Item triggered"); // todo - remove
    setDeleteActionFlag(!deleteActionFlag);
  };

  const renderItemFlatList = ({ item }) => {
    return <AppCredentialProvider provider={item} onDeleteAction={handleDeleteAction} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topDashboard}>
        <View style={styles.metricButtonsContainer}>
          <AppCredentialMetric
            iconName={'web'}
            iconColor={selected === 'web' ? LIGHT_GREEN : BLACK} // Check if selected is 'web' to set icon color
            iconLibrary={'material'}
            iconSize={screenWidth * 0.11}
            text="Web"
            subText={webCredentialCount}
            onPress={() => handleAppCredentialMetricPress('web')}
            style={styles.metricButton}
          />
          <AppCredentialMetric
            iconName={'card'}
            iconColor={selected === 'card' ? LIGHT_GREEN : BLACK} // Check if selected is 'card' to set icon color
            iconLibrary={'ion'}
            iconSize={screenWidth * 0.11}
            text="Card"
            subText={cardCredentialCount}
            onPress={() => handleAppCredentialMetricPress('card')}
            style={styles.metricButton}
          />
        </View>
        <View>
          <AppRoundTouchable
            iconName={'plus'}
            iconColor={BLACK}
            iconSize={screenWidth * 0.17}
            iconLibrary={'material'}
            onPress={() => navigation.navigate('Credential')}
            touchableStyle={styles.addButton}
          />
        </View>
      </View>
      <AppSearchBar onSearch={(searchText) => handleSearchTextChange(searchText)} />
      <FlatList
        data={credentialProviders}
        renderItem={renderItemFlatList}
        keyExtractor={(item) => item.type + item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topDashboard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderWidth: 0,
    borderRadius: 25,
    marginTop: screenHeight * 0.014,
    marginHorizontal: screenWidth * 0.024,
    borderColor: LIGHT_GREY,
    paddingVertical: screenHeight * 0.013,
  },
  metricButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: screenWidth * 0.017,
  },
  metricButton: {
    width: metricButtonWidth,
    borderWidth: 0,
    borderRadius: metricButtonWidth / 2,
  },
  addButton: {
    marginRight: screenWidth * 0.009,
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: (screenWidth * 0.25) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: LIGHT_GREY,
  },
});

export default VaultScreen;

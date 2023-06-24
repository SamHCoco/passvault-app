import React, { useState, useEffect } from 'react';
import { Text, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/Screen';
import AppCredentialMetric from '../components/AppCredentialMetric';
import AppSearchBar from '../components/AppSearchBar';
import AppRoundTouchable from '../components/AppRoundTouchable';
import AppWebCredential from '../components/AppWebCredential';
import AppCredentialProvider from '../components/AppCredentialProvider';
import search from '../service/search';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('passvault.db');

function VaultScreen({ selectedOption }) {
  const [web, setWeb] = useState([]);
  const [card, setCard] = useState([]);
  const [credentialProviders, setCredentialProviders] = useState([]);
  const [webCredentialCount, setWebCredentialCount] = useState(0);
  const [cardCredentialCount, setCardCredentialCount] = useState(0);

  const navigation = useNavigation();

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
      })),
    ];
    setCredentialProviders(providers);
  };

  // const renderWebCredentialItem = ({ item }) => {
  //   const { username, password } = item;
  //   return <AppWebCredential username={username} password={password} />;
  // };

  /**
   * Search bar handler
   */
  const handleSearch = (searchText) => {
    console.log('handleSearch invoked');
    search(searchText)
      .then((searchResults) => {
        console.log('FOUND SEARCH RESULTS: ', searchResults);
        setCredentialProviders(searchResults);
      })
      .catch((error) => {
        console.log('Error searching:', error);
      });
  };

  // const renderHiddenItem = (data, rowMap) => {
  //   return (
  //     <View style={styles.rowBack}>
  //       <TouchableOpacity style={styles.editButton} onPress={() => console.log('Edit pressed')}>
  //         <Text>Edit</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.deleteButton} onPress={() => console.log('Delete pressed')}>
  //         <Text>Delete</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  const createTables = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS web (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)',
        [],
        (_, result) => {
          console.log('Web table created successfully');
        },
        (_, error) => {
          console.log('Error creating web table:', error);
        }
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS web_credential (id INTEGER PRIMARY KEY AUTOINCREMENT, web_id INTEGER NOT NULL, web_url_id INTEGER NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL, FOREIGN KEY (web_id) REFERENCES web(id), FOREIGN KEY (web_url_id) REFERENCES web_url(id), UNIQUE (web_url_id, username))',
        [],
        (_, result) => {
          console.log('Web Credential table created successfully');
        },
        (_, error) => {
          console.log('Error creating web_credential table:', error);
        }
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS web_url (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, web_id INTEGER, FOREIGN KEY (web_id) REFERENCES web(id))',
        [],
        (_, result) => {
          console.log('Web URL table created successfully');
        },
        (_, error) => {
          console.log('Error creating web_url table:', error);
        }
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS card (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)',
        [],
        (_, result) => {
          console.log('Card table created successfully');
        },
        (_, error) => {
          console.log('Error creating card table:', error);
        }
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS card_credential (id INTEGER PRIMARY KEY AUTOINCREMENT, card_id INTEGER NOT NULL, card_number TEXT NOT NULL, exp_date TEXT NOT NULL, security_code INTEGER, FOREIGN KEY (card_id) REFERENCES card(id), UNIQUE (card_id, card_number))',
        [],
        (_, result) => {
          console.log('Card Credential table created successfully');
        },
        (_, error) => {
          console.log('Error creating card_credential table:', error);
        }
      );
    });
  };

  const fetchRecords = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT id, name FROM web ORDER BY name ASC',
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
    // createTables();
    fetchRecordsFromTable(selectedOption ? selectedOption : web);
    countCredentials();
  }, []);

  const handleAppCredentialMetricPress = (type) => {
    if (type === 'web') {
      fetchRecordsFromTable('web');
    } else if (type === 'card') {
      fetchRecordsFromTable('card');
    }
  };

  const fetchRecordsFromTable = (tableName) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableName}`,
        [],
        (_, { rows }) => {
          const records = rows._array;
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
          console.log(`Error retrieving ${tableName} records:`, error);
        }
      );
    });
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
            onPress={() => handleAppCredentialMetricPress('web')
            }
          />
          <AppCredentialMetric
            iconName={'card'}
            iconColor={'black'}
            iconLibrary={'ion'}
            iconSize={45}
            text="Card"
            subText={cardCredentialCount}
            onPress={() => handleAppCredentialMetricPress('card')}
          />
        </View>

        <AppRoundTouchable
          iconName={'plus'}
          iconColor={'black'}
          iconSize={75}
          iconLibrary={'material'}
          onPress={() => navigation.navigate('EditWebCredentialScreen')}
        />
      </View>
      <AppSearchBar onSearch={(searchText) => handleSearch(searchText)} />
      <FlatList
        data={credentialProviders}
        renderItem={({ item }) => renderItemFlatList({ item })}
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

const renderItemFlatList = ({ item }) => {
  return <AppCredentialProvider provider={item} />;
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

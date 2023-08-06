import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { SwipeListView }  from 'react-native-swipe-list-view';
import { useNavigation } from '@react-navigation/native';

import AppWebCredential from './AppWebCredential';
import AppCardCredential from './AppCardCredential';
import AppRoundTouchable from './AppRoundTouchable';

import {  WHITE } from '../constants/colors';

import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import { PASSVAULT_KEY } from '../service/constants';

import { decryptValue } from '../service/crypto';

const db = SQLite.openDatabase('passvault.db');
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AppCredentialProvider = ({ provider, onDeleteAction }) => {
  const navigation = useNavigation();

  const [id, setId] = useState(provider.id);
  const [type, setType] = useState(provider.type);
  const [credentials, setCredentials] = useState([]);
  const [showList, setShowList] = useState(false);

  const [deletionCompleted, setDeletionCompleted] = useState(false);

  const fetchData = async () => {
    const show = !showList;
    if (show) {
      const masterKey = await SecureStore.getItemAsync(PASSVAULT_KEY);
      db.transaction((tx) => {
        if (type === 'web') {
          tx.executeSql(
            'SELECT wc.id, wc.username, wc.password, wc.web_url_id, wu.url, wc.web_id AS webId, w.name, "web" AS type FROM web_credential AS wc INNER JOIN web_url AS wu ON wc.web_url_id = wu.id INNER JOIN web AS w ON wc.web_id = w.id WHERE wc.web_id = ?',
            [id],
            async (_, { rows }) => {
              const webCredentialRecords = rows._array;

              // Iterate over and print the objects
              for (const record of webCredentialRecords) {              
                const decryptedUrl = await decryptValue(record.url, masterKey);
                const decryptedUsername = await decryptValue(record.username, masterKey);
                const decryptedPassword = await decryptValue(record.password, masterKey);
                
                record.url = decryptedUrl;
                record.username = decryptedUsername;
                record.password = decryptedPassword;
              }
  
            setCredentials(webCredentialRecords);
            },
            (error) => {
              console.log('Error retrieving web credential records:', error);
            }
          );
        } else if (type === 'card') {
          tx.executeSql(
            'SELECT cc.id, cc.card_number AS cardNumber, cc.exp_date AS expDate, cc.card_id AS cardId, cc.security_code AS securityCode, c.name AS bank, "card" AS type FROM card_credential AS cc INNER JOIN card AS c ON cc.card_id = c.id WHERE cc.card_id = ?',
            [id],
            async (_, { rows }) => {
              const cardCredentialRecords = rows._array;

              for (const record of cardCredentialRecords) {
                
                const decryptedCardNumber = await decryptValue(record.cardNumber, masterKey);
                const decryptedSecurityCode = await decryptValue(record.securityCode, masterKey);
                const decryptedExpDate = await decryptValue(record.expDate, masterKey);
                
                record.cardNumber = decryptedCardNumber;
                record.securityCode = decryptedSecurityCode;
                record.expDate = decryptedExpDate;
              }

              setCredentials(cardCredentialRecords);
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
        <AppRoundTouchable iconName="pencil" 
                           iconSize={screenWidth * 0.0584} 
                           iconColor={WHITE} 
                           touchableStyle={styles.editButton}
                           onPress={() => handleEditPress(data)} />
        <AppRoundTouchable iconName="md-trash" 
                           iconSize={screenWidth * 0.0584} 
                           iconColor={WHITE} 
                           iconLibrary="ion"
                           touchableStyle={styles.editButton}
                           onPress={() => handleDeletePress(data)} />
      </View>
    );
  };

  const handleEditPress = (data) => {
    const {item } = data;
    item.username ? item.type = 'web' : item.type = 'card';
    navigation.navigate('Credential', {
        item: item
     });
  };

  const handleDeletePress = (data) => {
    const { id, type, cardId, webId } = data.item;
  
    db.transaction((tx) => {
      if (type === 'web') {
        // Fetch the web_url_id from the web_credential table for the given id
        tx.executeSql(
          'SELECT web_url_id FROM web_credential WHERE id = ?',
          [id],
          (_, { rows }) => {
            const { web_url_id } = rows.item(0); // Retrieve the web_url_id from the result
  
            tx.executeSql(
              'DELETE FROM web_credential WHERE id = ?',
              [id],
              (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                  // Now, delete the web_url with the stored web_url_id
                  tx.executeSql(
                    'DELETE FROM web_url WHERE id = ?',
                    [web_url_id], // Use the stored web_url_id
                    (_, { rowsAffected }) => {
                      if (rowsAffected > 0) {
                        // Perform any additional actions on success
                      }
                    },
                    (error) => {
                      console.log(`Error deleting web_url with ID ${web_url_id}:`, error);
                    }
                  );
  
                  // Check if there are any other web credentials with the same web_id
                  tx.executeSql(
                    'SELECT COUNT(*) AS count FROM web_credential WHERE web_id = ?',
                    [webId],
                    (_, { rows }) => {
                      const { count } = rows.item(0);
                      if (count === 0) {
                        // No other web credentials with the same web_id, delete the web credential
                        tx.executeSql(
                          'DELETE FROM web WHERE id = ?',
                          [webId],
                          (_, { rowsAffected }) => {
                            if (rowsAffected > 0) {
                              // Perform any additional actions on success
                            }
                          },
                          (error) => {
                            console.log(`Error deleting web with ID ${webId}:`, error);
                          }
                        );
                      }
                    },
                    (error) => {
                      console.log('Error checking web credentials:', error);
                    }
                  );
                  setDeletionCompleted(true); // Mark deletion as completed
                }
              },
              (error) => {
                console.log(`Error deleting web credential with ID ${id}:`, error);
              }
            );
          },
          (error) => {
            console.log(`Error fetching web_url_id for web_credential with ID ${id}:`, error);
          }
        );
      } else if (type === 'card') {
        tx.executeSql(
          'DELETE FROM card_credential WHERE id = ?',
          [id],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              setDeletionCompleted(true); // Mark deletion as completed
  
              // Check if there are any other card credentials with the same card_id
              tx.executeSql(
                'SELECT COUNT(*) AS count FROM card_credential WHERE card_id = ?',
                [cardId],
                (_, { rows }) => {
                  const { count } = rows.item(0);
                  if (count === 0) {
                    // No other card credentials with the same card_id, delete the card credential
                    tx.executeSql(
                      'DELETE FROM card WHERE id = ?',
                      [cardId],
                      (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                          // Perform any additional actions on success
                        }
                      },
                      (error) => {
                        console.log('Error deleting card:', error);
                      }
                    );
                  }
                },
                (error) => {
                  console.log('Error checking card credentials:', error);
                }
              );
            }
          },
          (error) => {
            console.log('Error deleting card credential:', error);
          }
        );
      }
    });
  };

  if (deletionCompleted) {
    fetchData(); // Fetch updated data after deletion
    setDeletionCompleted(false); // Reset deletion completion status
  }

  return (
    <View>
      <TouchableOpacity onPress={fetchData}>
        <View style={styles.container}>
          <Image source={require('../assets/passvault-icon-final.png')} style={styles.image} />
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
    borderColor: 'white',
    borderRadius: screenWidth * 0.0365,
    width: screenWidth * 0.95,
    padding: screenWidth * 0.02435,
    marginVertical: screenHeight * 0.01,
    marginHorizontal: screenWidth * 0.01,
    backgroundColor: 'white',
  },
  image: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    marginRight: screenWidth * 0.02,
  },
  label: {
    fontSize: screenWidth * 0.065,
    // fontWeight: 'bold',
    color: 'black',
    marginLeft: screenWidth * 0.03,
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: WHITE,
    marginHorizontal: screenWidth * 0.03,
    marginVertical: 0,
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth * 0.1,
    height: '95%',
    backgroundColor: 'lightgreen',
    alignSelf: 'flex-end',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth * 0.1,
    height: '95%',
    backgroundColor: 'lightgreen',
    alignSelf: 'flex-end',
  },
});

export default AppCredentialProvider;
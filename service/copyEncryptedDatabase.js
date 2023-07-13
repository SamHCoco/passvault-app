import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

import { encryptValue, decryptValue } from './crypto';
import { PASSVAULT_KEY } from './constants';

// Assuming you have defined the decryptValue and encryptValue methods

const copyEncryptedDatabase = async (databaseName, key) => {
    const masterKey = await SecureStore.getItemAsync(PASSVAULT_KEY);

    try {
      // Open the existing database
      const sourceDB = SQLite.openDatabase('passvault.db');
  
      // Create the new database
      const destinationDB = SQLite.openDatabase(`${databaseName}.db`);
  
      // Copy all tables except web_credential and card_credential
      await new Promise((resolve, reject) => {
        sourceDB.transaction((tx) => {
          tx.executeSql(
            `SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('web_credential', 'card_credential');`,
            [],
            (_, { rows: { _array } }) => {
              _array.forEach((table) => {
                const tableName = table.name;
                tx.executeSql(`SELECT * FROM ${tableName};`, [], async (_, { rows }) => {
                  const records = rows._array;
                  destinationDB.transaction(async (tx) => {
                    const columns = Object.keys(records[0]).join(', ');
                    const values = [];
                    for (const record of records) {
                      const recordValues = Object.values(record).map((value) => {
                        if (typeof value === 'string') {
                          return `'${value}'`;
                        }
                        return value;
                      });
                      values.push(recordValues.join(', '));
                    }
                    tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns});`);
                    for (const value of values) {
                      tx.executeSql(`INSERT INTO ${tableName} (${columns}) VALUES (${value});`);
                    }
                  });
                });
              });
            },
            reject
          );
        }, reject, resolve);
      });
  
      // Copy and encrypt specific columns from the existing database to the new database (web_credential)
      await new Promise((resolve, reject) => {
        sourceDB.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM web_credential;',
            [],
            async (_, { rows: { _array } }) => {
              const encryptedWebRecords = [];
              for (const record of _array) {
                const decryptedUsername = await decryptValue(record.username, masterKey);
                const decryptedPassword = await decryptValue(record.password, masterKey);

                console.log("decryptedUsername: ", decryptedUsername); // todo - remove
                console.log("decryptedPassword: ", decryptedPassword); // todo - remove
  
                const encryptedUsername = await encryptValue(decryptedUsername, key);
                const encryptedPassword = await encryptValue(decryptedPassword, key);
  
                encryptedWebRecords.push({
                  ...record,
                  username: encryptedUsername,
                  password: encryptedPassword,
                });
              }
  
              destinationDB.transaction(async (tx) => {
                const columns = Object.keys(encryptedWebRecords[0]).join(', ');
                const values = [];
                for (const record of encryptedWebRecords) {
                  const encryptedValues = [];
                  for (const value of Object.values(record)) {
                    if (typeof value === 'string') {
                      encryptedValues.push(await encryptValue(value, key));
                    } else {
                      encryptedValues.push(value);
                    }
                  }
                  values.push(
                    encryptedValues
                      .map((value) => (typeof value === 'string' ? `'${value}'` : value))
                      .join(', ')
                  );
                }
                tx.executeSql(`CREATE TABLE IF NOT EXISTS web_credential (${columns});`);
                for (const value of values) {
                   tx.executeSql(`INSERT INTO web_credential (${columns}) VALUES (${value});`);
                }
              }, reject, resolve);
            },
            reject
          );
        });
      });
  
      // Copy and encrypt specific columns from the existing database to the new database (card_credential)
      await new Promise((resolve, reject) => {
        sourceDB.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM card_credential;',
            [],
            async (_, { rows: { _array } }) => {
              const encryptedCardRecords = [];
              for (const record of _array) {
                const decryptedCardNumber = await decryptValue(record.card_number, masterKey);
                const decryptedExpDate = await decryptValue(record.exp_date, masterKey);
                const decryptedSecurityCode = await decryptValue(record.security_code, masterKey);

                console.log("decryptedCardNumber: ", decryptedCardNumber); // todo - remove
                console.log("decryptedExpDate: ", decryptedExpDate); // todo - remove
                console.log("decryptedSecurityCode: ", decryptedSecurityCode); // todo - remove
  
                const encryptedCardNumber = await encryptValue(decryptedCardNumber, key);
                const encryptedExpDate = await encryptValue(decryptedExpDate, key);
                const encryptedSecurityCode = await encryptValue(decryptedSecurityCode, key);
  
                encryptedCardRecords.push({
                  ...record,
                  card_number: encryptedCardNumber,
                  exp_date: encryptedExpDate,
                  security_code: encryptedSecurityCode,
                });
              }
  
              destinationDB.transaction(async (tx) => {
                const columns = Object.keys(encryptedCardRecords[0]).join(', ');
                const values = [];
                for (const record of encryptedCardRecords) {
                  const encryptedValues = [];
                  for (const value of Object.values(record)) {
                    if (typeof value === 'string') {
                      encryptedValues.push(await encryptValue(value, key));
                    } else {
                      encryptedValues.push(value);
                    }
                  }
                  values.push(
                    encryptedValues
                      .map((value) => (typeof value === 'string' ? `'${value}'` : value))
                      .join(', ')
                  );
                }
                tx.executeSql(`CREATE TABLE IF NOT EXISTS card_credential (${columns});`);
                for (const value of values) {
                  await tx.executeSql(`INSERT INTO card_credential (${columns}) VALUES (${value});`);
                }
              }, reject, resolve);
            },
            reject
          );
        });
      });
  
      console.log('Database copied successfully!');
    } catch (error) {
      console.error('Error copying the database:', error);
    }
  };

  export default copyEncryptedDatabase;
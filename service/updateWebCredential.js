import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

import { encryptValue } from '../service/crypto';
import { PASSVAULT_KEY } from './constants';

const db = SQLite.openDatabase('passvault.db');

const updateWebCredential = async (values) => {
  const { url, name, username, password } = values;

  const masterKey = await SecureStore.getItemAsync(PASSVAULT_KEY);

  const encryptedUrl = await encryptValue(url, masterKey);
  const encryptedUsername = await encryptValue(username, masterKey);
  const encryptedPassword = await encryptValue(password, masterKey);

  // Fetch the existing web entry
  const existingWeb = await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id FROM web WHERE LOWER(name) = ? LIMIT 1',
        [name.toLowerCase()],
        (_, { rows }) => {
          resolve(rows.item(0));
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  if (!existingWeb) {
    console.log("Web entry not found. Cannot update.");
    return;
  }

  const webId = existingWeb.id;

  // Update the web credentials
  const updateWebCredentialEntry = async () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE web_credential SET username = ?, password = ? WHERE web_id = ?',
          [encryptedUsername, encryptedPassword, webId],
          (_, result) => {
            resolve(result);
            console.log("Web credentials updated successfully.");
          },
          (_, error) => {
            reject(error);
            console.log("Failed to update Web credentials:", error);
          }
        );
      });
    });
  };

  // Update the web URL if provided
  if (url) {
    const existingWebUrl = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT id FROM web_url WHERE url = ? AND web_id = ? LIMIT 1',
          [encryptedUrl, webId],
          (_, { rows }) => {
            resolve(rows.item(0));
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });

    if (existingWebUrl) {
      // Web URL already exists, update it
      const webUrlId = existingWebUrl.id;
      await new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE web_url SET url = ? WHERE id = ?',
            [encryptedUrl, webUrlId],
            (_, result) => {
              resolve(result);
              console.log("Web URL updated successfully.");
            },
            (_, error) => {
              reject(error);
              console.log("Failed to update Web URL:", error);
            }
          );
        });
      });
    } else {
      // Web URL does not exist, insert it
      const insertWebUrl = await new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO web_url (url, web_id) VALUES (?, ?)',
            [encryptedUrl, webId],
            (_, { insertId }) => {
              resolve(insertId);
              console.log("New Web URL added.");
            },
            (_, error) => {
              reject(error);
              console.log("Failed to save new Web URL:", error);
            }
          );
        });
      });
    }
  }

  // Perform the web credentials update
  await updateWebCredentialEntry();
};

export default updateWebCredential;

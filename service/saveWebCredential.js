import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

import { encryptValue } from '../service/crypto';
import { PASSVAULT_KEY } from './constants';

const db = SQLite.openDatabase('passvault.db');

const saveWebCredential = async (values) => {
  const { url, name, username, password } = values;

  const masterKey = await SecureStore.getItemAsync(PASSVAULT_KEY);

  const encryptedUrl = await encryptValue(url, masterKey);
  const encryptedUsername = await encryptValue(username, masterKey);
  const encryptedPassword = await encryptValue(password, masterKey);

  // Persist name in the web table
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

  const insertWebCredential = async (webUrlId, webId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO web_credential (web_url_id, web_id, username, password) VALUES (?, ?, ?, ?)',
          [webUrlId, webId, encryptedUsername, encryptedPassword],
          (_, { insertId }) => {
            resolve(insertId);
            console.log("New Web Credentials added with web_url_id ", webUrlId);
          },
          (_, error) => {
            reject(error);
            console.log("Failed to save Web Credentials:", error);
          }
        );
      });
    });
  };

  if (existingWeb) {
    const webId = existingWeb.id;

    const insertWebUrl = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO web_url (url, web_id) VALUES (?, ?)',
          [encryptedUrl, webId],
          (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });

    const insertId = await insertWebCredential(insertWebUrl, webId);
  } else {
    const insertWeb = await new Promise((resolve, reject) => {
      db.transaction(async (tx) => {
        tx.executeSql(
          'INSERT INTO web (name) VALUES (?)',
          [name],
          async (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });

    const webId = insertWeb;

    const insertWebUrl = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO web_url (url, web_id) VALUES (?, ?)',
          [encryptedUrl, webId],
          (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });

    const insertId = await insertWebCredential(insertWebUrl, webId);
  }
};

export default saveWebCredential;

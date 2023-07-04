import * as SQLite from 'expo-sqlite';
import { encryptValue, decryptValue} from '../service/crypto';

import downloadFavicon from './downloadFavIcon';

const db = SQLite.openDatabase('passvault.db');

const saveWebCredential = async (values) => {
  const { url, username, password } = values;

  const key = "password1";

  const encryptedUsername = await encryptValue(username, key);
  const encryptedPassword = await encryptValue(password, key);

  // Extract domain from URL and lowercase it
  const domain = url.toLowerCase().replace(/^(?:https?:\/\/)?(?:www\.)?([^/.]+).*$/, '$1');

  // Search for a match in the web(name) table
  const existingWeb = await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id FROM web WHERE LOWER(name) = ? LIMIT 1',
        [domain],
        (_, { rows }) => {
          resolve(rows.item(0));
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  // Insert into web_credential table
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

  // Handle the found or new web record
  if (existingWeb) {
    // Use the existing web_id
    const webId = existingWeb.id;

    const insertWebUrl = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO web_url (url, web_id) VALUES (?, ?)',
          [url, webId],
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
    console.log('Credential saved successfully with ID:', insertId);
  } else {
    // Insert a new record into web table
    const insertWeb = await new Promise((resolve, reject) => {
      db.transaction(async (tx) => {
        tx.executeSql(
          'INSERT INTO web (name) VALUES (?)',
          [domain],
          async (_, { insertId }) => {
            resolve(insertId);
    
            // Save the favicon image as an asset
            await downloadFavicon(url, domain);
            
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
          [url, webId],
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
    console.log('Credential saved successfully with ID:', insertId);
  }
};

export default saveWebCredential;
import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

import { encryptValue } from '../service/crypto';
import { PASSVAULT_KEY } from './constants';

const db = SQLite.openDatabase('passvault.db');

const updateWebCredential = async (values) => {
  const { id, url, name, username, password } = values;

  const masterKey = await SecureStore.getItemAsync(PASSVAULT_KEY);

  const encryptedUrl = await encryptValue(url, masterKey);
  const encryptedUsername = await encryptValue(username, masterKey);
  const encryptedPassword = await encryptValue(password, masterKey);

  // Get the web_id from the web_credential table for the provided id
  const webIdResult = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT web_id FROM web_credential WHERE id = ?',
        [id],
        (_, { rows }) => {
          resolve(rows.item(0));
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  const webId = webIdResult?.web_id; // Retrieve the web_id from the result

  if (!webId) {
    console.log('Web ID not found for the provided ID:', id);
    return;
  }

  // Get the web record with the matching name (case-insensitive query)
  const webRecord = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
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

  let newWebId;

  // Check if the web record exists, or insert a new one if it doesn't
  if (webRecord) {
    newWebId = webRecord.id;
  } else {
    // Insert a new record into the 'web' table
    const insertWebRecord = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO web (name) VALUES (?)',
          [name],
          (_, { insertId }) => {
            resolve(insertId);
            console.log('New Web record added.');
          },
          (_, error) => {
            reject(error);
            console.log('Failed to save new Web record:', error);
          }
        );
      });
    });

    newWebId = insertWebRecord;
  }

  // Update the 'web_id' in the 'web_credential' table
  const updateWebCredentialEntry = async () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE web_credential SET web_id = ?, username = ?, password = ? WHERE id = ?',
          [newWebId, encryptedUsername, encryptedPassword, id],
          (_, result) => {
            resolve(result);
            console.log('Web credentials updated successfully.');
          },
          (_, error) => {
            reject(error);
            console.log('Failed to update Web credentials:', error);
          }
        );
      });
    });
  };

  // Update the web URL if provided
  if (url) {
    const existingWebUrl = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
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
        db.transaction((tx) => {
          tx.executeSql(
            'UPDATE web_url SET url = ? WHERE id = ?',
            [encryptedUrl, webUrlId],
            (_, result) => {
              resolve(result);
              console.log('Web URL updated successfully.');
            },
            (_, error) => {
              reject(error);
              console.log('Failed to update Web URL:', error);
            }
          );
        });
      });
    } else {
      // Web URL does not exist, insert it
      const insertWebUrl = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO web_url (url, web_id) VALUES (?, ?)',
            [encryptedUrl, webId],
            (_, { insertId }) => {
              resolve(insertId);
              console.log('New Web URL added.');
            },
            (_, error) => {
              reject(error);
              console.log('Failed to save new Web URL:', error);
            }
          );
        });
      });
    }
  }

  // Perform the web credentials update
  await updateWebCredentialEntry();

  // Count the number of records in the web_credential table with the given webId
  const webCredentialCount = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM web_credential WHERE web_id = ?',
        [webId],
        (_, { rows }) => {
          resolve(rows.item(0).count);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  // If the count is zero, delete the record in the web table with the corresponding webId
  if (webCredentialCount === 0) {
    await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM web WHERE id = ?',
          [webId],
          (_, result) => {
            resolve(result);
            console.log('Web record deleted successfully.');
          },
          (_, error) => {
            reject(error);
            console.log('Failed to delete Web record:', error);
          }
        );
      });
    });
  }
};

export default updateWebCredential;

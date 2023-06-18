import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('passvault.db');

const saveWebCredential = async (values) => {
  const { url, username, password } = values;

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
  const insertWebCredential = async (webId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO web_credential (web_id, username, password) VALUES (?, ?, ?)',
          [webId, username, password],
          (_, { insertId }) => {
            resolve(insertId);
            console.log("New Web Credentials added with web_id ", webId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  // Handle the found or new web record
  if (existingWeb) {
    // Use the existing web_id
    const webId = existingWeb.id;
    const insertId = await insertWebCredential(webId);
    console.log('Credential saved successfully with ID:', insertId);
  } else {
    // Insert a new record into web table
    const insertWeb = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO web (name) VALUES (?)',
          [domain],
          (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });

    // Use the new web_id
    const webId = insertWeb;
    const insertId = await insertWebCredential(webId);
    console.log('Credential saved successfully with ID:', insertId);
  }
};

export default saveWebCredential;

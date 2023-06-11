import * as SQLite from 'expo-sqlite';

const web_cred_db = 'web_credentials';

const db = SQLite.openDatabase(
    {
      name: 'passvault.db',
      location: 'default',
    },
    () => {
      console.log('PassVault Database opened successfully');
    },
    error => {
      console.error('Failed to open PassVault database:', error);
    }
  );

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' + web_cred_db + '(id SMALLINT PRIMARY KEY AUTOINCREMENT, username VARCHAR(255), password VARCHAR(255), url VARCHAR(255))'
    );
  });

  const saveWebCredential = (username, password, url) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO ' + web_cred_db + '(username, password, url) VALUES (?, ?, ?)',
          [username, password, url],
          (_, result) => {
            console.log('Web credential saved successfully');
            resolve(result);
          },
          (_, error) => {
            console.error('Failed to save web credential:', error);
            reject(error);
          }
        );
      });
    });
  };
  
  const getWebCredentials = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM ' + web_cred_db,
          [],
          (_, { rows }) => {
            const webCredentials = rows._array;
            console.log('Web Credentials:', webCredentials);
            resolve(webCredentials);
          },
          (_, error) => {
            console.error('Failed to retrieve web credentials:', error);
            reject(error);
          }
        );
      });
    });
  };
  
  const updateWebCredential = (id, username, password, url) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE ' + web_cred_db + ' SET username = ?, password = ?, url = ? WHERE id = ?',
          [username, password, url, id],
          (_, result) => {
            console.log('Web credential updated successfully');
            resolve(result);
          },
          (_, error) => {
            console.error('Failed to update web credential:', error);
            reject(error);
          }
        );
      });
    });
  };
  
  const deleteWebCredential = id => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM ' + web_cred_db + ' WHERE id = ?',
          [id],
          (_, result) => {
            console.log('Web credential deleted successfully');
            resolve(result);
          },
          (_, error) => {
            console.error('Failed to delete web credential:', error);
            reject(error);
          }
        );
      });
    });
  };
  
  export { saveWebCredential, getWebCredentials, updateWebCredential, deleteWebCredential };

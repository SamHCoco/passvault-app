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

  const createTables = () => {
    db.transaction(tx => {
      tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' + web_cred_db + '(id SMALLINT PRIMARY KEY AUTOINCREMENT, username VARCHAR(255), password VARCHAR(255), url VARCHAR(255))'
      );
    });
  }
  
  const saveWebCredential = (username, password, url, successCallback, errorCallback) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO web_credentials (username, password, url) VALUES (?, ?, ?)',
        [username, password, url],
        (_, result) => {
          console.log('Web credential saved successfully');
          successCallback(result);
        },
        (_, error) => {
          console.error('Failed to save web credential:', error);
          errorCallback(error);
        }
      );
    });
  };
  
  const getWebCredentials = (successCallback, errorCallback) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM web_credentials',
        [],
        (_, { rows }) => {
          const webCredentials = rows._array;
          console.log('Web Credentials:', webCredentials);
          successCallback(webCredentials);
        },
        (_, error) => {
          console.error('Failed to retrieve web credentials:', error);
          errorCallback(error);
        }
      );
    });
  };
  
  const updateWebCredential = (id, username, password, url, successCallback, errorCallback) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE web_credentials SET username = ?, password = ?, url = ? WHERE id = ?',
        [username, password, url, id],
        (_, result) => {
          console.log('Web credential updated successfully');
          successCallback(result);
        },
        (_, error) => {
          console.error('Failed to update web credential:', error);
          errorCallback(error);
        }
      );
    });
  };
  
  const deleteWebCredential = (id, successCallback, errorCallback) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM web_credentials WHERE id = ?',
        [id],
        (_, result) => {
          console.log('Web credential deleted successfully');
          successCallback(result);
        },
        (_, error) => {
          console.error('Failed to delete web credential:', error);
          errorCallback(error);
        }
      );
    });
  };
  
  export { saveWebCredential, getWebCredentials, updateWebCredential, deleteWebCredential, createTables };

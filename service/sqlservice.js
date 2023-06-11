import SQLite from 'react-native-sqlite-storage';

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
        'CREATE TABLE IF NOT EXISTS' + web_cred_db + '(id SMALLINT PRIMARY KEY AUTOINCREMENT, username VARCHAR(255), password VARCHAR(255), url VARCHAR(255))'
    );
  });

const saveWebCredentials = (username, password) => {
    db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO' + web_cred_db + '(username, password, url) VALUES (?, ?, ?)',
          [username, password],
          (_, result) => {
            console.log('Web credentials saved successfully');
          },
          (_, error) => {
            console.error('Failed to save web-credentials:', error);
          }
        );
      });
};


const getWebCredentials = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM ' + web_cred_db,
        [],
        (_, { rows }) => {
          const web_credentials = rows._array;
          console.log('Web credentials:', web_credentials);
        },
        (_, error) => {
          console.error('Failed to retrieve web credentials:', error);
        }
      );
    });
  };



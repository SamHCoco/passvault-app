import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase({ name: 'passvault.db', location: 'default' });

export const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS web (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)',
      [],
      (_, result) => {
        console.log('Web table created successfully');
      },
      (_, error) => {
        console.log('Error creating web table:', error);
      }
    );

    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS card (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)',
      [],
      (_, result) => {
        console.log('Card table created successfully');
      },
      (_, error) => {
        console.log('Error creating card table:', error);
      }
    );

    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS web_credential (id INTEGER PRIMARY KEY AUTOINCREMENT, web_id INTEGER NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL, FOREIGN KEY (web_id) REFERENCES web(id), UNIQUE (web_id, username))',
      [],
      (_, result) => {
        console.log('Web Credential table created successfully');
      },
      (_, error) => {
        console.log('Error creating web_credential table:', error);
      }
    );

    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS card_credential (id INTEGER PRIMARY KEY AUTOINCREMENT, card_id INTEGER NOT NULL, card_number TEXT NOT NULL, exp_date TEXT NOT NULL, security_code INTEGER, FOREIGN KEY (card_id) REFERENCES card(id), UNIQUE (card_id, card_number))',
      [],
      (_, result) => {
        console.log('Card Credential table created successfully');
      },
      (_, error) => {
        console.log('Error creating card_credential table:', error);
      }
    );
  });
};


export default createTables;
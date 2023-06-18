import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('passvault.db');

const saveCardCredential = async (values) => {
  const { bank, cardNumber, expDate, securityCode } = values;

  console.log("CARD CREDENTIAL VALUES :", bank); // todo - remove

  // Search for a match in the card(name) table
  const existingCard = await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id FROM card WHERE name = ? LIMIT 1',
        [bank],
        (_, { rows }) => {
          resolve(rows.item(0));
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  // Insert into card_credential table
  const insertCardCredential = async (cardId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO card_credential (card_id, card_number, exp_date, security_code) VALUES (?, ?, ?, ?)',
          [cardId, cardNumber, expDate, securityCode],
          (_, { insertId }) => {
            resolve(insertId);
            console.log("New Card Credentials added with card_id ", cardId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  // Handle the found or new card record
  if (existingCard) {
    // Use the existing card_id
    const cardId = existingCard.id;
    const insertId = await insertCardCredential(cardId);
    console.log('Card credentials saved successfully with ID:', insertId);
  } else {
    // Insert a new record into card table
    const insertCard = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO card (name) VALUES (?)',
          [bank],
          (_, { insertId }) => {
            resolve(insertId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });

    // Use the new card_id
    const cardId = insertCard;
    const insertId = await insertCardCredential(cardId);
    console.log('Card credentials saved successfully with ID:', insertId);
  }
};

export default saveCardCredential;

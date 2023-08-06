import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

import { PASSVAULT_KEY } from './constants';
import { encryptValue} from '../service/crypto';

const db = SQLite.openDatabase('passvault.db');

const saveCardCredential = async ({
  bank,
  cardNumber,
  expirationMonth,
  expirationYear,
  securityCode,
}) => {
  const expDate = `${expirationMonth}-${expirationYear}`;
  
  // Search for a match in the card(name) table
  const existingCard = await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id FROM card WHERE LOWER(name) = ? LIMIT 1',
        [bank.toLowerCase()],
        (_, { rows }) => {
          resolve(rows.item(0));
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  const masterKey = await SecureStore.getItemAsync(PASSVAULT_KEY);
  
  const encryptedCardNumber = await encryptValue(cardNumber, masterKey);
  const encryptedExpDate = await encryptValue(expDate, masterKey);
  const encryptedSecurityCode = await encryptValue(securityCode, masterKey);

  // Insert into card_credential table
  const insertCardCredential = async (cardId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql( 
          'INSERT INTO card_credential (card_id, card_number, exp_date, security_code) VALUES (?, ?, ?, ?)',
          [cardId, encryptedCardNumber, encryptedExpDate, encryptedSecurityCode],
          (_, { insertId }) => {
            resolve(insertId);
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
  }
};

export default saveCardCredential;

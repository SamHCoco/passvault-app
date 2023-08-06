import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

import { PASSVAULT_KEY } from './constants';
import { encryptValue } from '../service/crypto';

const db = SQLite.openDatabase('passvault.db');

const updateCardCredential = async ({
  bank,
  cardNumber,
  expirationMonth,
  expirationYear,
  securityCode,
}) => {
  const expDate = `${expirationMonth}-${expirationYear}`;
  const masterKey = await SecureStore.getItemAsync(PASSVAULT_KEY);

  // Search for a match in the card(name) table
  const existingCard = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
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

  const encryptedCardNumber = await encryptValue(cardNumber, masterKey);
  const encryptedExpDate = await encryptValue(expDate, masterKey);
  const encryptedSecurityCode = await encryptValue(securityCode, masterKey);

  // Update or insert into card_credential table
  const updateCardCredential = async (cardId) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT id FROM card_credential WHERE card_id = ?',
          [cardId],
          (_, { rows }) => {
            const existingCredentialId = rows.item(0)?.id;
            if (existingCredentialId) {
              // Update the existing credential
              tx.executeSql(
                'UPDATE card_credential SET card_number = ?, exp_date = ?, security_code = ? WHERE id = ?',
                [encryptedCardNumber, encryptedExpDate, encryptedSecurityCode, existingCredentialId],
                (_, { rowsAffected }) => {
                  if (rowsAffected > 0) {
                    resolve(existingCredentialId);
                  } else {
                    reject(new Error('Failed to update card credential.'));
                  }
                },
                (_, error) => {
                  reject(error);
                }
              );
            } else {
              // Insert a new credential
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
            }
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
    try {
      await updateCardCredential(cardId);
      // Optionally, you can handle the successful update here
    } catch (error) {
      // Handle the error during the update process
      console.log('Error updating card credential:', error);
    }
  } else {
    // Insert a new record into card table
    try {
      const insertCard = await new Promise((resolve, reject) => {
        db.transaction((tx) => {
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
      try {
        await updateCardCredential(cardId);
        // Optionally, you can handle the successful insert and update here
      } catch (error) {
        // Handle the error during the insert and update process
        console.log('Error inserting and updating card credential:', error);
      }
    } catch (error) {
      // Handle the error during the card insert process
      console.log('Error inserting card:', error);
    }
  }
};

export default updateCardCredential;

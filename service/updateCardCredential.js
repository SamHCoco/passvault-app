import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

import { PASSVAULT_KEY } from './constants';
import { encryptValue } from '../service/crypto';

const db = SQLite.openDatabase('passvault.db');

const updateCardCredential = async ({
  id,
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
  const updateCardCredentialEntry = async (cardId) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE card_credential SET card_number = ?, exp_date = ?, security_code = ?, card_id = ? WHERE id = ?',
          [encryptedCardNumber, encryptedExpDate, encryptedSecurityCode, cardId, id],
          (_, result) => {
            resolve(result);
            console.log('Card credentials updated successfully.');
          },
          (_, error) => {
            reject(error);
          }
        );
      }, (error) => {
        // Transaction error handling
        console.log('Transaction error:', error);
      }, () => {
        // Transaction success handling
        console.log('Transaction successful.');
      });
    });
  };

  // Get the card_id from the card_credential table for the provided ID
  const getCardId = async () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT card_id FROM card_credential WHERE id = ?',
          [id],
          (_, { rows }) => {
            resolve(rows.item(0)?.card_id);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  // Handle the found or new card record
  let cardId = await getCardId();
  let oldCardId = cardId;

  if (existingCard) {
    cardId = existingCard.id;
    try {
      await updateCardCredentialEntry(cardId);
    } catch (error) {
      console.log('Error updating card credentials:', error);
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
              // Assign the newly inserted card_id to the cardId variable
              cardId = insertId;
              resolve(insertId);
            },
            (_, error) => {
              reject(error);
            }
          );
        });
      });

      // Use the new card_id
      try {
        await updateCardCredentialEntry(cardId);
      } catch (error) {
        console.log('Error inserting and updating card credential:', error);
      }
    } catch (error) {
      console.log('Error inserting card:', error);
    }
  }

  // Check if a new card record was inserted and if there are no records in card_credential with the old card_id
  if (oldCardId && oldCardId !== cardId) {
    const noRecordsWithOldCardId = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM card_credential WHERE card_id = ?',
          [oldCardId],
          (_, { rows }) => {
            resolve(rows.item(0).count === 0);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });

    // If no records exist with the old card_id, delete the card from the card table
    if (noRecordsWithOldCardId) {
      await new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'DELETE FROM card WHERE id = ?',
            [oldCardId],
            (_, result) => {
              resolve(result);
            },
            (_, error) => {
              reject(error);
              console.log('Failed to delete card record:', error);
            }
          );
        });
      });
    }
  }
};

export default updateCardCredential;
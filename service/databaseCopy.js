import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

// Function to copy the database and encrypt it
export const copyAndEncryptDatabase = async (key) => {
  const dbName = 'your_database.db';
  const encryptedDbName = 'encrypted_database.db';

  try {
    // Open the source database
    const db = SQLite.openDatabase(dbName);

    // Retrieve all tables from the database
    const tables = await executeSql(db, "SELECT name FROM sqlite_master WHERE type='table'");

    if (tables.length === 0) {
      console.log('No tables found in the database.');
      return;
    }

    // Create a new encrypted database
    const encryptedDb = SQLite.openDatabase(encryptedDbName, key);

    // Loop through each table and copy its content to the encrypted database
    for (const table of tables) {
      const tableName = table.name;
      const rows = await executeSql(db, `SELECT * FROM ${tableName}`);
      const createTableSql = await executeSql(db, `SELECT sql FROM sqlite_master WHERE name='${tableName}'`);

      // Create table in the encrypted database with the same schema
      await executeSql(encryptedDb, createTableSql[0].sql);

      // Insert rows into the encrypted database
      for (const row of rows) {
        const columnNames = Object.keys(row).join(', ');
        const placeholders = Object.keys(row).fill('?').join(', ');
        const values = Object.values(row);

        await executeSql(encryptedDb, `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`, values);
      }
    }

    console.log('Database copy and encryption completed successfully.');
  } catch (error) {
    console.log('An error occurred:', error);
  }
};

// Helper function to execute SQL queries
const executeSql = (db, sql, params = []) =>
  new Promise((resolve, reject) =>
    db.transaction((transaction) => {
      transaction.executeSql(
        sql,
        params,
        (_, resultSet) => resolve(resultSet.rows._array),
        (_, error) => reject(error)
      );
    })
  );

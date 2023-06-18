import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase({ name: 'passvault.db', location: 'default' });

export const search = (searchText) => {
  console.log('Search text:', searchText);
  const searchResults = [];
  return new Promise((resolve, reject) => {
    
    db.transaction(
      (tx) => {
        const webQuery = 'SELECT id, name FROM web WHERE name = ?';
        const cardQuery = 'SELECT id, name FROM card WHERE name = ?';

        const webPromise = new Promise((webResolve, webReject) => {
          console.log('Web query executing with:', `%${searchText}%`);
          tx.executeSql(
            webQuery,
            [searchText],
            (_, result) => {
              console.log('Web query result:', result);
              const len = result.rows.length;
              for (let i = 0; i < len; i++) {
                const row = result.rows.item(i);
                searchResults.push({ id: row.id, name: row.name, type: 'web' });
              }
              webResolve(); // Resolve the webPromise when the web query completes
            },
            (_, error) => {
              webReject(error);
            }
          );
        });

        const cardPromise = new Promise((cardResolve, cardReject) => {
          console.log('Card query executing with:', `%${searchText}%`);
          tx.executeSql(
            cardQuery,
            [searchText],
            (_, result) => {
              console.log('Card query result:', result);
              const len = result.rows.length;
              for (let i = 0; i < len; i++) {
                const row = result.rows.item(i);
                searchResults.push({ id: row.id, name: row.name, type: 'card' });
              }
              cardResolve(); // Resolve the cardPromise when the card query completes
            },
            (_, error) => {
              cardReject(error);
            }
          );
        });

        // Wait for both queries to complete
        Promise.all([webPromise, cardPromise])
          .then(() => {
            resolve(searchResults); // Resolve the main promise with the populated searchResults array
          })
          .catch((error) => {
            reject(error);
          });
      },
      (error) => {
        reject(error);
      },
      () => {
        resolve(searchResults);
      }
    );
  });
};

export default search;

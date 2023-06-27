import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

export async function saveFaviconAsAsset(url, domain, insertId) {
    const fileName = domain + '.ico';
  
    try {
      const response = await fetchFavicon(url);
      console.log("DOMAIN FROM FAVICON request: ", domain);
      console.log("INSERT ID FROM FAVICON request: ", insertId);
      console.log("RESPONSE FROM FAVICON Request: ", response);
  
      // Save the favicon image to the local file system
      const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + fileName);
      if (!fileInfo.exists) {
        await FileSystem.copyAsync({
          from: response.uri,
          to: FileSystem.documentDirectory + fileName,
        });
      }
  
      // Save the favicon asset path to the SQLite database
      const db = SQLite.openDatabase('passvault.db');
      db.transaction((tx) => {
        console.log("fileInfo.uri: ", fileInfo.uri);
        tx.executeSql('UPDATE web SET favicon = ? WHERE id = ?', [fileInfo.uri, insertId]);
      });
  
      return fileInfo.uri;
    } catch (error) {
      console.log('Error saving favicon:', error);
    }
  }
  

async function fetchFavicon(url) {
    const faviconUrl = new URL('/favicon.ico', url).href;
    const response = await fetch(faviconUrl);
    if (!response.ok) {
      throw new Error('Favicon request failed');
    } else {
      console.log("Favicon request success!"); // todo - remove
    }
  
    const downloadDir = FileSystem.documentDirectory + 'favicon.ico';
  
    // Delete existing favicon file if it exists
    const fileInfo = await FileSystem.getInfoAsync(downloadDir);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(downloadDir);
    }
  
    // Download and save the favicon file
    const result = await FileSystem.downloadAsync(faviconUrl, downloadDir);
  
    // Retrieve the updated fileInfo after the file is saved
    const updatedFileInfo = await FileSystem.getInfoAsync(downloadDir);
  
    return updatedFileInfo.uri;
  }
  

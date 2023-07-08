import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';

const copyDatabaseFile = async (filename) => {
  try {
    const dbFilePath = `${FileSystem.documentDirectory}SQLite/passvault.db`;

    // Check if the source database file exists
    const dbFileExists = await FileSystem.getInfoAsync(dbFilePath);
    if (!dbFileExists.exists) {
      console.log('Source database file does not exist.');
      return;
    }

    // Request permission to access the device's storage
    const { status } = await Permissions.askAsync(Permissions.READ_EXTERNAL_STORAGE);
    console.log("STATUS: ", status); // todo - remove
    if (status !== 'granted') {
      console.log('Permission to access storage denied Test.');
      return;
    }

    // Let the user select the destination directory
    const { uri, type } = await DocumentPicker.getDocumentAsync({
      type: DocumentPicker.types.allFiles,
    });

    if (uri !== null) {
      const destinationFilePath = `${uri}/${filename}$.db`;

      // Copy the database file to the destination directory
      await FileSystem.copyAsync({
        from: dbFilePath,
        to: destinationFilePath,
      });

      console.log('Database file copied successfully!');
    } else {
      console.log('No destination directory selected.');
    }
  } catch (error) {
    console.log('An error occurred while copying the database file:', error);
  }
};

export default copyDatabaseFile;

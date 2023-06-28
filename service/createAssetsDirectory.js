import * as FileSystem from 'expo-file-system';

const createAssetsDirectory = async () => {
  const directoryName = 'assets';
  const directoryPath = FileSystem.documentDirectory + directoryName;

  try {
    const directoryExists = await FileSystem.getInfoAsync(directoryPath);

    if (!directoryExists.exists) {
      await FileSystem.makeDirectoryAsync(directoryPath, { intermediates: true });
      console.log(`Directory '${directoryName}' created successfully.`);
    } else {
      console.log(`Directory '${directoryName}' already exists.`);
    }
  } catch (error) {
    console.log(`Error creating directory: ${error}`);
  }
};

export default createAssetsDirectory;

import * as FileSystem from 'expo-file-system';


const downloadFavicon = async (url, domain) => {
  const assetsDirectory = `${FileSystem.documentDirectory}assets/`;
  const faviconFileName = `${assetsDirectory}${domain}.ico`;

  try {
    const { uri } = await FileSystem.downloadAsync(`https://www.google.com/s2/favicons?domain=${url}`, faviconFileName);
    console.log(`Favicon for ${url} downloaded successfully at ${uri}`);
  } catch (error) {
    console.log(`Error downloading favicon: ${error}`);
  }
};

export default downloadFavicon;
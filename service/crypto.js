import CryptoES from 'crypto-es';

const encryptValue = async (plainText, key) => {
  return new Promise((resolve, reject) => {
    try {
        const encrypted = CryptoES.AES.encrypt(plainText, key).toString();
        resolve(encrypted);
    } catch (error) {
        reject(error);
    }
  });
};

const decryptValue = async (encryptedText, key) => {
  return new Promise((resolve, reject) => {
    try {
      const decrypted = CryptoES.AES.decrypt(encryptedText, key).toString(CryptoES.enc.Utf8);
      resolve(decrypted);
    } catch (error) {
      reject(error);
    }
  });
};

export { encryptValue, decryptValue };

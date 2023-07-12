import CryptoES from 'crypto-es';

const encryptValue = async (plainText, key) => {
  return new Promise((resolve, reject) => {
    if (!plainText) {
      console.log("PLAIN TEXT HAS NO VALUE");
      reject(new Error("Plain text is missing."));
    } else {
      console.log("PLAIN-TEXT: ", plainText);
      const encrypted = CryptoES.AES.encrypt(plainText, key).toString();
      console.log("ENCRYPT KEY: ", key);
      console.log("ENCRYPTED: ", encrypted);
      decryptValue(encrypted, key)
        .then(() => resolve(encrypted))
        .catch(reject);
    }
  });
};

const decryptValue = async (encryptedText, key) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("ENCRYPTED TEXT BEFORE DECRYPTION: ", encryptedText);
      const decrypted = CryptoES.AES.decrypt(encryptedText, key).toString(CryptoES.enc.Utf8);
      console.log("DECRYPT METHOD KEY: ", key);
      console.log("DECRYPTED: ", decrypted);
      resolve(decrypted);
    } catch (error) {
      reject(error);
    }
  });
};

export { encryptValue, decryptValue };

import { AES, enc } from 'react-native-crypto-js';
import * as Crypto from 'expo-crypto';
import { encode, decode } from './base64';

const ENCRYPTION_KEY_SIZE = 32; // 256-bit key for AES
const ENCRYPTION_IV_SIZE = 16; // 128-bit IV for AES

// Convert a byte array to a base64 string
function bytesToBase64(bytes) {
  return encode(bytes);
}

// Convert a base64 string to a byte array
function base64ToBytes(base64) {
  return decode(base64);
}

// Encrypts the plain text value using AES symmetric key encryption
export async function encryptValue(plainTextValue, key) {
  const encryptionKey = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    key
  );

  const encryptionIV = await Crypto.getRandomBytesAsync(ENCRYPTION_IV_SIZE);
  const encryptionIVBase64 = bytesToBase64(encryptionIV);

  const encryptedValue = AES.encrypt(
    plainTextValue,
    encryptionKey.slice(0, ENCRYPTION_KEY_SIZE), // Use only the first 32 bytes (256 bits) of the key
    { iv: encryptionIVBase64 }
  ).toString();

  // Combine the encryption IV and the encrypted value
  const combinedValue = encryptionIVBase64 + encryptedValue;

  return combinedValue;
}

// Decrypts the encrypted value using AES symmetric key decryption
export async function decryptValue(combinedValue, key) {
  const encryptionIVBase64 = combinedValue.slice(0, ENCRYPTION_IV_SIZE * 4);
  const encryptedValue = combinedValue.slice(ENCRYPTION_IV_SIZE * 4);

  const decryptionKey = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    key
  );

  const decryptionIV = base64ToBytes(encryptionIVBase64);

  const decryptedValue = AES.decrypt(
    encryptedValue,
    decryptionKey.slice(0, ENCRYPTION_KEY_SIZE), // Use only the first 32 bytes (256 bits) of the key
    { iv: decryptionIV }
  ).toString(enc.Utf8); // Convert the decrypted value to UTF-8 string

  return decryptedValue;
}

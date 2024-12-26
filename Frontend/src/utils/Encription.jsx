// client/src/utils/encryption.js
import CryptoJS from 'crypto-js';


const secretKey = "zipchat@6123456789qqwertyasdfghjklbhyvftcdelofgnhswcfkubbfttwk"; // Ideally, derive this securely

export const encryptMessage = (message) =>{
    return CryptoJS.AES.encrypt(message, secretKey).toString();
};

export const decryptMessage = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

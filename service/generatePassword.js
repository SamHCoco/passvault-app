const generateRandomPassword = ({ length, includeNumbers, includeSpecialChars, includeUpperCase, includeLowerCase }) => {
    let chars = '';
    let password = '';
  
    if (includeNumbers) {
      chars += '0123456789';
    }
    if (includeUpperCase) {
      chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (includeLowerCase) {
      chars += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (includeSpecialChars) {
      chars += '!@#$%&*_';
    }
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
  
    return password;
  };
  
export default generateRandomPassword;

  
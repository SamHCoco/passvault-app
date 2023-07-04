// Base64 encoding
function encode(input) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let output = '';
    let i = 0;
    const length = input.length;
  
    while (i < length) {
      const chr1 = input[i++];
      const chr2 = i < length ? input[i++] : '';
      const chr3 = i < length ? input[i++] : '';
  
      const enc1 = chr1 >> 2;
      const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      const enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      const enc4 = chr3 & 63;
  
      output +=
        chars.charAt(enc1) +
        chars.charAt(enc2) +
        (chr2 ? chars.charAt(enc3) : '=') +
        (chr3 ? chars.charAt(enc4) : '=');
    }
  
    return output;
  }
  
  // Base64 decoding
  function decode(input) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let i = 0;
    const length = input.length;
  
    while (i < length) {
      const enc1 = chars.indexOf(input.charAt(i++));
      const enc2 = chars.indexOf(input.charAt(i++));
      const enc3 = chars.indexOf(input.charAt(i++));
      const enc4 = chars.indexOf(input.charAt(i++));
  
      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;
  
      output += String.fromCharCode(chr1);
  
      if (enc3 !== 64) {
        output += String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output += String.fromCharCode(chr3);
      }
    }
  
    return output;
  }
  
  export { encode, decode };
  
const isValidUrl = (url) => {
    const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;
    return urlPattern.test(url);
  };
  
  export default isValidUrl;
  
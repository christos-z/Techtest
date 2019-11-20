var crypto = require('crypto');

  //used for creating a salt as well as a login token
  const generateRandomString = (length) => crypto.randomBytes(Math.ceil(length/2))
    .toString('hex') 
    .slice(0,length);  
  
  const passTheSalt = (password, salt) => {
      const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
      hash.update(password);
      const value = hash.digest('hex');
      return {
          salt:salt,
          passwordHash:value
      };
  };
  
  function saltHashPassword(userpassword) {
      const salt = generateRandomString(16); 
      return passTheSalt(userpassword, salt);
  }

  //ideally, I'd implement a JWT solution instead of this, but I simply don't have time.
  const generateSession = () => generateRandomString(20);
  
  module.exports = { saltHashPassword, generateSession, passTheSalt };
  
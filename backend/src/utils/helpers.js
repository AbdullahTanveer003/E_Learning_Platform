const crypto = require('crypto');

const generateUniqueCode = () => {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
};

module.exports = { generateUniqueCode };

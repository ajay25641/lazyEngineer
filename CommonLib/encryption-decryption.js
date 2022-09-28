const bcrypt = require("bcrypt");

/**
 * @info encrypts string
 * @param {string} plainPassword 
 * @returns {string}
 */
function encryptPassword(plainPassword) {
  const value = bcrypt.hashSync(plainPassword,10);
  return value;
}

/**
 * @info encripts plainPassword and check if it is same as of encryptPassword
 * @param {string} plainPassword 
 * @param {string} encryptedPassword 
 * @returns {boolean}
 */
function decryptPassword(plainPassword, encryptedPassword) {
  return bcrypt.compareSync(plainPassword,encryptedPassword);
}

module.exports = {
  encryptPassword,
  decryptPassword,
};

// ========================
// 加密解密算法
// ========================
const crypto = require('crypto');


/**
 * 加密
 * @method cipher
 * @param  {string}   algorithm 算法
 * @param  {string}   key       密钥
 * @param  {string}   buf       需要加密的内容
 * @param  {Function} callback  回调函数
 * @return {object}             加密后的字符串
 */
function cipher(algorithm, key, buf, callback) {
  let encrypted = '';
  const cip = crypto.createCipher(algorithm, key);
  encrypted += cip.update(buf, 'binary', 'hex');
  encrypted += cip.final('hex');
  return callback(encrypted);
}

//
/**
 * 解密
 * @method decipher
 * @param  {string}   algorithm 算法
 * @param  {string}   key       密钥
 * @param  {string}   encrypted 需要解密的内容
 * @param  {Function} cb        [description]
 * @return {object}   解密后的字符串
 */
function decipher(algorithm, key, encrypted, callback) {
  let decrypted = '';
  const decip = crypto.createDecipher(algorithm, key);
  decrypted += decip.update(encrypted, 'hex', 'binary');
  decrypted += decip.final('binary');
  return callback(decrypted);
}


/**
 * 生成随机密钥
 * @method getRandomKey
 * @param  {number}  size 密钥长度
 * @return {string}  key  密钥
 */
function getRandomKey(size) {
  return crypto.randomBytes(size).toString('hex');
}


module.exports = {
  cipher,
  decipher,
  getRandomKey,
};

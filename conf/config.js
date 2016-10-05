const config = {
  // 加密模块的配置
  encrypt: {
    // 加密算法 ['blowfish','aes-256-cbc','cast','des','des3','idea','rc2','rc4','seed', ...]
    algorithm: 'rc4',
    // 密钥长度
    size: 6,
  },
};


module.exports = config;

const config = {
  // 加密模块的配置
  encrypt: {
    // 加密算法 ['blowfish','aes-256-cbc','cast','des','des3','idea','rc2','rc4','seed', ...]
    algorithm: 'rc4',
    // 密钥长度
    size: 6,
  },
  crawler: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36',
  },
};


module.exports = config;

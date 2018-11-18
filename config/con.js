const crypto = require('crypto');

//md5 加密
exports.md5 = (str)=>{
    let md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

// 数据库初始化
exports.mysql = ()=>{
    return{
        HOST:'localhost',
		USER:'root',
		PASS:'123456',
		DB:'data',
		PORT:3306,
    }
}
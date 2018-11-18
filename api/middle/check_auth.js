const jwt = require('jsonwebtoken');

//token前置校验
module.exports = (req,res,next)=>{
    try{
        const token = req.body.token.trim();
        const decode = jwt.verify(token,'byzhkc3');
        req.userData = decode;
        next();
    }catch(err){
        return res.status(200).json({
            code:401,
            msg:"token校验失败",
            err:err
        });
    }
}
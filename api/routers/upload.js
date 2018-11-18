const express = require('express');
const router = express.Router();
const conFn = require('../../config/con');
const checkAuth = require('../middle/check_auth');
const multer = require('multer');

// 创建存储库
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/');
    },
    filename:(req,file,cb)=>{
        console.log(file);
        let type = file.mimetype;
        let imgType =type.substr(type.indexOf('/')+1);
        cb(null,conFn.md5(new Date().toISOString()+file.originalname+'byzhkc3')+`.${imgType}`);
    },
});


// 文件格式过滤
const fileFilter = (req,file,cb)=>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5//5mb
    },
    fileFilter: fileFilter
});

// router.post('/img' ,upload.single("img"),checkAuth,(req,res,next)=>{

// });

router.get('/',(req,res,next)=>{
    res.status(200).json({
        code:200,
        msg:'数据获取成功!'
    });
});

router.post('/img' ,upload.single("img"),(req,res,next)=>{
    res.status(200).json({
        name:req.body.name,
        path:req.file.path
    });
});

module.exports = router;
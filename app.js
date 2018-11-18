const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyPaeser = require('body-parser');

// 初始化数据库连接
// const db = require('./config/db');
// const conFn = require('./config/con');

// 初始化数据库
// db.init(conFn.mysql());

// 导入路由
const uploadsRouter = require('./api/routers/upload');

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyPaeser.json({limit:'5mb'}));
app.use(bodyPaeser.urlencoded({limit:'5mb',extended:false}));


// 跨域处理
app.use((req, res, next) => {
    console.log(req.body);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,GET,DELETE');
        return res.status(200).json({});
    }
    next();
});

// 使用导入的路由
app.use('/upload',uploadsRouter);

//错误处理
app.use((req, res, next) => {
    
    const error = new Error('接口不存在');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    
    res.status(error.status || 500);
    res.json({
        error: {
            msg: error.message
        }
    });
});


module.exports = app;




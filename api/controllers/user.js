// const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const conFn = require('../../config/con');
const db = require('../../config/db');

// 注册
exports.user_signup = (req, res, next) => {
    const email = req.body.email.trim();
    const pass = conFn.md5(req.body.pass.trim() + 'byzhkc3');
    const name = req.body.name.trim();

    const user = {
        email,
        pass,
        name
    }

    // 检测邮箱是否存在
    db.is_email_exist(email, (exist) => {
        // 判断是否存在
        if (exist) {
            console.log('存在');
            res.status(200).json({
                code: 401,
                msg: '邮箱已存在'
            });
        } else {
            console.log('不存在');
            db.create_user(email, name, pass, (ret) => {
                if (ret) {
                    res.status(201).json({
                        code: 201,
                        msg: '用户创建成功',
                        data: user
                    });
                } else {
                    res.status(200).json({
                        code: 401,
                        msg: '用户创建失败'
                    });
                }
            });
        }
    });

}

//登录
exports.user_login = (req, res, next) => {
    const email = req.body.email.trim();
    const pass = conFn.md5(req.body.pass.trim() + 'byzhkc3');

    db.user_login(email, pass, (data) => {
        if (data != null) {
            let id = data.id;
            let name = data.name;
            // token
            const token = jwt.sign({
                        email: email,
                        userId: id
                    }, 'byzhkc3', {
                        expiresIn: "2 days"
                    });

            res.status(200).json({
                code: 200,
                msg: "登录成功",
                data: {
                    email: email,
                    name:name,
                    token: token
                }
            });
        } else {
            res.status(200).json({
                code:404,
                msg:"该账号不存在!"
            });
        }
    });
}
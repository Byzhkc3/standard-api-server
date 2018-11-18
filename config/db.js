const mysql = require('mysql');

let pool = null;

function nop (a,b,c,d,e,f,g){

}

function query (sql,cb){
    pool.getConnection((err,conn)=>{
        if(err){
            cb(err,null,null);
        }else{
            conn.query(sql,(qerr,val,fiel)=>{
                //释放连接
                conn.release();
                // 回调
                cb(qerr,val,fiel);
            });
        }
    });
}

// 初始化数据库连接
exports.init = (config)=>{
    pool = mysql.createPool({
        host:config.HOST,
        user:config.USER,
        password:config.PASS,
        database:config.DB,
        port:config.PORT
    });
}

//检测账号是否存在
exports.is_email_exist = (email,cb)=>{
    cb = cb == null ? nop :cb;
    if(email == null){
        cb(false);
        return ;
    }
    
    let sql =  `SELECT * FROM t_user WHERE email = "${email}";`;
    // 查询
    query(sql,(err,rows,fiel)=>{
        if(err){
            cb(false);
            throw err;
        }else{
            if(rows.length > 0){
                cb(true);
            }else{
                cb(false);
            }
        }

    });
}

// 邮箱获取账号id
exports.email2id = (email,cb)=>{
    cb = cb == null ? nop :cb;
    if(email == null ){
        cb(false);
        return ;
    }

    let sql = `SELECT * FROM t_user WHERE email="${email}";`;
   
    query(sql,(err,rows,fiel)=>{
        if(err){
            cb(null);
            throw err;
        }

        if(rows.length === 0){
            cb(null);
            return;
        }
        // 返回查询的第一条数据
        cb(rows[0].id);
    });
}


// 注册用户
exports.create_user = (email,name,pass,cb)=>{
    cb = cb == null ? nop :cb;
    if(email == null || pass == null || name == null){
        cb(false);
        return ;
    }

    let sql = `INSERT INTO t_user(email,name,pass) VALUES("${email}","${name}","${pass}");`;
    // 执行插入
    query(sql,(err,rows,fiel)=>{
        if(err){
            if(err.code === 'ER_DUP_ENTRY'){
                cb(false);
                return;
            }
            cb(false);
            throw err;
        }else{
            cb(true);
        }
    });
    
}

//用户登录 
exports.user_login = (email,pass,cb)=>{
    cb = cb == null ? nop :cb;
    if(email == null || pass == null){
        cb(false);
        return ;
    }

    let sql = `SELECT * FROM t_user WHERE email="${email}" AND pass="${pass}";`;
   
    query(sql,(err,rows,fiel)=>{
        if(err){
            cb(null);
            throw err;
        }

        if(rows.length === 0){
            cb(null);
            return;
        }
        // 返回查询的第一条数据
        cb(rows[0]);
    });
}


//添加新的教程
exports.create_post = (obj,cb)=>{
    cb = cb == null ? nop :cb;
    let title = obj.title;
    let content = obj.content;
    let code_type = obj.code_type;
    let lang_type = obj.lang_type;
    let user_id = obj.user_id

    if(title == null || content == null){
        cb(false);
        return ;
    }

    let sql = `INSERT INTO post(user_id,title,content,code_type,lang_type) VALUES("${user_id}","${title}","${content}",${code_type},${lang_type});`;
    // 执行插入
    query(sql,(err,rows,fiel)=>{
        if(err){
            if(err.code === 'ER_DUP_ENTRY'){
                cb(false);
                return;
            }
            cb(false);
            throw err;
        }else{
            cb(true);
        }
    });

}

//获取分享总数
exports.get_all_count = (cb)=>{
    let sql = 'SELECT count(id) from post;';

    query(sql,(err,rows,fiel)=>{
        if(err){
            cb(null);
            throw err;
        }

        if(rows.length === 0){
            cb(null);
            return;
        }

        // 返回查询的第一条数据
        cb(rows[0]);
    });

}

//获取列表
exports.get_list = (limitStart,pageSize,cb)=>{
    cb = cb == null ? nop :cb;
    if(limitStart == null || pageSize == null){
        cb(false);
        return ;
    }

    let limit = `LIMIT ${limitStart},${pageSize}`;

    let sql = `SELECT * FROM post ORDER BY id DESC ${limit};`;

    query(sql,(err,rows,fiel)=>{
        if(err){
            cb(null);
            throw err;
        }

        if(rows.length === 0){
            cb(null);
            return;
        }
        // 返回查询的数据 
        cb(rows);
    });
}


// 搜索
exports.search_title = (title,cb)=>{
    cb = cb == null ? nop :cb;
    if(title == null || title == ''){
        cb(false);
        return ;
    }
    
    let limit = `LIMIT 0,20`;

    let sql = `SELECT * FROM post WHERE title like '%${mysql.escape(title)}%' ORDER BY id DESC ${limit};`;

    query(sql,(err,rows,fiel)=>{
        if(err){
            cb(null);
            throw err;
        }

        if(rows.length === 0){
            cb(null);
            return;
        }
        // 返回查询的数据 
        cb(rows);
    });
}

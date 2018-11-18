const db = require('../../config/db');

// 获取列表
exports.get_list = (req,res,next)=>{
    console.log(req.query);
    console.log(req.query.pageSize);
    let pageSize = req.query.pageSize != null ? parseInt(req.query.pageSize) : 10;
    let pageNum = req.query.pageNum != null ? parseInt(req.query.pageNum) : 1;
    

    db.get_all_count((ret)=>{
        if(ret != null){
            let count = ret['count(id)'];
            const totalPage = Math.ceil(parseInt(count) / pageSize);

            if(pageNum < 1){
                pageNum = 1;
            }else if(pageNum > totalPage){
                pageNum = totalPage;
            }

            let limitStart =  (pageNum -1 ) * pageSize;
            db.get_list(limitStart,pageSize,(rev)=>{
                if(rev != null){
                    res.status(200).json({
                        msg: '数据获取成功',
                        code: 200,
                        data:rev,
                        page:{
                            pageNum:pageNum,
                            total:totalPage
                        }
                    });
                }else{
                    res.status(200).json({
                        msg: '暂无数据',
                        code: 202,
                    });
                }
            });

            
        }else{
            res.status(200).json({
                msg: '总数获取失败',
                code: 404
            });
        }
    })



    
}

//添加分享
exports.post_content = (req,res,next)=>{
    console.log(req.body.token);
    let email = req.body.email.trim();
    let title = req.body.title;
    let content = req.body.content;
    let code_type = parseInt(req.body.code_type);
    let lang_type = parseInt(req.body.lang_type);

    if(email == null || title == null || content == null){
        return res.status(200).json({
            msg: '参数异常',
            code: 404
        });
    }

    db.email2id(email,(id)=>{
        if(id != null){
            let data = {
                user_id:id,
                title:title,
                content:content,
                code_type:code_type,
                lang_type:lang_type
            }

            db.create_post(data,(ret)=>{
                if(ret){
                    res.status(200).json({
                        msg: '数据提交成功',
                        code: 200
                    });
                }else{
                    res.status(200).json({
                        msg: '数据提交失败',
                        code:404
                    });
                }
            });
        }else{
            res.status(200).json({
                msg: 'id获取失败',
                code: 404
            });
        }
        
    });

}



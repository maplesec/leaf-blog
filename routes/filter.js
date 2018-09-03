function authorize (resource, permission) {
    return function (req, res, next){
        if (!req.session.user_id) {
            res.send({
                status: 2,
                type: 'ERROR_SESSION',
                message: '没有登录',
            })
        } else {
            const user_id = req.session.user_id;
            if (resource) {
                global.acl.isAllowed(user_id, resource, permission, function(err, result){
                    if (result) {
                        next()
                    } else {
                        res.send({
                            status: 0,
                            type: 'ERROR_PERMISSION',
                            message: '没有权限'
                        })
                    }
                })
            } else {
                next()
            }

        }
    }
}
export default authorize
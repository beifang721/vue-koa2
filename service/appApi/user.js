const Router = require('koa-router')
let router = new Router();
const mongoose = require('mongoose')

router.get('/', async (ctx) => {
    ctx.body = "这是用户操作首页"
})

// 注册
router.post('/register', async (ctx) => {
    //取得Model
    const User = mongoose.model('User')
    //把从前端接收的POST数据封装成一个新的user对象
    let newuser = new User(ctx.request.body);
    //用mongoose的save方法直接存储，然后判断是否成功，返回相应的结果
    await newuser.save().then(() => {
        //成功返回code=200，并返回成功信息
        ctx.body = {
            code: 200,
            message: '注册成功'
        }
    }).catch((error) => {
        ctx.body = {
            code: 500,
            message: error
        }
    })
})

router.post('/login', async (ctx) => {
    let loginUser = ctx.request.body
    let userName = loginUser.userName
    let password = loginUser.password
    //引入User的model
    const User = mongoose.model('User')
    await User.findOne({ userName: userName }).exec().then(async (result) => {
        console.log(result);
        //当用户名存在时，开始比对密码
        let newUser = new User()  //因为是实例方法，所以要new出对象，才能调用
        if (result) {
            await newUser.comparePassword(password, result.password)
            .then((isMatch)=>{
                console.log(isMatch)
                //返回比对结果
                ctx.body={ code:200, message:isMatch}
            })
            .catch(error=>{
                //出现异常，返回异常
                console.log(error)
                ctx.body={ code:500, message:error}
            })
        } else {
            ctx.body = {
                code: 200, message: '用户名不存在'
            }
        }
    }).catch(error => {
        ctx.body = { code: 500, message: error }
    })

})

module.exports = router;
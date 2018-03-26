const router = require('koa-router')()
const userController = require("../controllers/usersController")


// 登录
router.post('/login.node',userController.logIn)
// 登出
router.post('/logout.node',userController.logOut)
//验证身份
router.get('/verifyUserId.node',userController.verifyUserId)




module.exports = router

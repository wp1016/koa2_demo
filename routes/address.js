const router = require('koa-router')()
const addressController = require('../controllers/addressController')

//获取用户地址列表
router.get('/queryUserAddress.node',addressController.queryUserAddress)
//添加新地址
router.post('/addAddress.node',addressController.addAddress)
//删除地址
router.post('/removeAddress.node',addressController.removeAddress)
//设置默认
router.post('/setDefault.node',addressController.setDefault)




module.exports = router
const router = require('koa-router')()
const goodsController = require('../controllers/goodsController')

//查询商品列表
router.get('/goodsList.node', goodsController.goodsList)



module.exports = router
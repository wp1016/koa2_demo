const router = require('koa-router')()
const cartController = require('../controllers/cartController')


//加入购物车
router.post('/addcart.node',cartController.addcart)
//查询购物车列表
router.get("/queryCartList.node", cartController.queryCartList)
//修改购物车中的商品数量
router.post("/changeProductNum.node", cartController.changeProductNum)
//删除购物车中的商品
router.post("/removeProduct.node", cartController.removeProduct)
//修改商品选中状态
router.post("/selectProduct.node", cartController.selectProduct)
//查询购物车商品数量
router.get("/queryCartCount.node", cartController.queryCartCount)
// 创建订单
router.post("/createOrder.node", cartController.createOrder)
// 获取订单详情
router.get("/getOrderDetail.node", cartController.getOrderDetail)


module.exports = router
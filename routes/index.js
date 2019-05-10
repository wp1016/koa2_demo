const router = require('koa-router')()
const goodsRouter = require('./goods');
const usersRouter = require('./users');
const cartsRouter = require('./carts');
const addressRouter = require('./address');
const verifySession = require('../public/verifySession')

router.prefix('/api/v1') 
router.use(verifySession)
// 商品列表
router.use("/goods", goodsRouter.routes(), goodsRouter.allowedMethods())
//用户列表
router.use("/users", usersRouter.routes(), usersRouter.allowedMethods())
//购物车列表
router.use("/carts", cartsRouter.routes(), cartsRouter.allowedMethods())
//地址列表
router.use("/address", addressRouter.routes(), addressRouter.allowedMethods())


module.exports = router
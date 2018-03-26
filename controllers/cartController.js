/*
 * @Author: wangpan 
 * 购物车接口列表
 * @Date: 2018-03-15 14:40:48 
 * @Last Modified by: wangpan
 * @Last Modified time: 2018-03-25 21:05:20
 */
require('../public/dateFormat')

const models = require('../mongoose/models')
const Dumall_users = models.dumall_users
const Dumall_goods = models.dumall_goods

/**
 * 查询购物车列表
 */
const queryCartList = async (ctx, next) => {
    let userId = ctx.session.userId
    try {
        let user = await Dumall_users.findOne({
            userId: userId
        })
        ctx.body = {
            resultCode: "000000",
            data: user.cartList,
            msg: "请求成功"
        }
    } catch (err) {
        ctx.throw(500, err)
    }
}

/**
 * 修改商品数量
 */
const changeProductNum = async (ctx, next) => {
    let userId = ctx.session.userId
    let {
        productId,
        productNum
    } = ctx.request.body;
    try {
        if (user) {
            for (let index = 0; index < user.cartList.length; index++) {
                if (user.cartList[index].productId == productId) {
                    if (productNum == 0) {
                        await user.cartList[index].remove();
                        user.markModified("cartList");
                        user.save();
                    } else {
                        user.cartList[index].productNum = productNum
                        user.markModified("cartList");
                        user.save();
                    }

                }
            }
            ctx.body = {
                resultCode: "000000",
                msg: "请求成功",
            }
        }
    } catch (err) {
        ctx.throw(500, err)
    }

}

/**
 * 删除当前商品
 */
const removeProduct = async (ctx, next) => {
    let productId = ctx.request.body.productId;
    let userId = ctx.session.userId
    if (!productId) {
        ctx.body = {
            resultCode: "000001",
            msg: "必传参数不能为空"
        }
    } else {
        try {
            await Dumall_users.update({
                userId: userId
            }, {
                $pull: {
                    cartList: {
                        productId: productId
                    }
                }
            })
            ctx.body = {
                resultCode: "000000",
                msg: "删除成功"
            }
        } catch (err) {
            ctx.throw(500, err)
        }
    }
}
/**
 * 选择当前商品
 */
const selectProduct = async (ctx, next) => {
    let userId = ctx.session.userId
    let productId = ctx.request.body.productId;
    if (!productId) {
        ctx.body = {
            resultCode: "000001",
            msg: "必传参数不能为空"
        }
    } else {
        try {
            let user = await Dumall_users.findOne({
                userId: userId
            })
            for (let index = 0; index < user.cartList.length; index++) {
                if (user.cartList[index].productId == productId) {
                    if (user.cartList[index].checked == "1") {
                        user.cartList[index].checked = "0"
                    } else {
                        user.cartList[index].checked = "1"
                    }
                    user.markModified("cartList"),
                        user.save();
                    ctx.body = {
                        resultCode: "000000",
                        msg: "修改成功"
                    }
                }
            }
        } catch (err) {
            ctx.throw(500, err)
        }
    }
}

/**
 * 查询购物车商品数量
 */
const queryCartCount = async (ctx, next) => {
    let userId = ctx.session.userId
    if (userId) {
        try {
            let user = await Dumall_users.findOne({
                userId: userId
            })
            let cartCount = 0;
            user.cartList.map((item) => {
                cartCount += parseInt(item.productNum)
            })
            ctx.body = {
                resultCode: "000000",
                msg: "请求成功",
                count: cartCount
            }
        } catch (err) {
            ctx.throw(500, err)
        }
    } else {
        ctx.body = {
            resultCode: "000001",
            msg: "请求成功",
            count: 0
        }
    }

}

/**
 * 加入购物车接口
 */
const addcart = async (ctx, next) => {
    let userId = ctx.session.userId;
    let payload = ctx.request.body;
    let productId = payload.productId
    try {
        let user = await Dumall_users.findOne({
            userId: userId
        })
        for (let index = 0; index < user.cartList.length; index++) {
            if (user.cartList[index].productId == productId) {
                user.cartList[index].productNum++;
                user.markModified("cartList");
                await user.save();
                ctx.body = {
                    resultCode: "000000",
                    msg: "加入成功"
                }
                return
            }
        }
        if (user) {
            let doc1 = await Dumall_goods.findOne({
                productId: productId
            }).lean();
            let pro = {}
            Object.assign(pro, doc1)
            pro.productNum = 1;
            pro.checked = "0";
            await user.cartList.push(pro);
            user.markModified("cartList");
            await user.save();
            ctx.body = {
                resultCode: "000000",
                msg: "加入成功"
            }
        }
    } catch (err) {
        ctx.throw(500, err)
    }
}

/**
 * 创建订单接口
 */
const createOrder = async (ctx, next) => {
    let userId = ctx.session.userId;
    try {
        let addressId = ctx.request.body.addressId;
        let user = await Dumall_users.findOne({
            userId: userId
        })
        let orderDetail = {
            orderId: '',
            orderTotal: 0,
            addressInfo: {},
            goodsList: [],
            orderStatus: '1',
            createDate: '',
        }
        let platform = '602' //平台码
        let r1 = Math.floor(Math.random() * 100)
        let r2 = Math.floor(Math.random() * 100)
        let sysDate = new Date().Format('yyyyMMddhhmmss');
        let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
        let productIds = []
        orderDetail.orderId = platform + r1 + sysDate + r2
        for (let index = 0; index < user.addressList.length; index++) {
            if (user.addressList[index].addressId == addressId) {
                orderDetail.addressInfo = user.addressList[index]
            }
        }
        for (let index = 0; index < user.cartList.length; index++) {
            let element = user.cartList[index];
            if (element.checked === "1") {
                orderDetail.goodsList.push(element)
                orderDetail.orderTotal += parseFloat(element.salePrice) * element.productNum
                productIds.push(element.productId)
            }
        }
        await Dumall_users.update({
            userId: userId
        }, {
            $pull: {
                cartList: {
                    productId: {
                        $in: productIds
                    }
                }
            }
        })
        await Dumall_users.update({
            userId: userId
        }, {
            $push: {
                orderList: orderDetail
            }
        })
        ctx.body = {
            resultCode: "000000",
            msg: '创建订单成功',
            info: {
                orderId: orderDetail.orderId
            }
        }
    } catch (err) {
        ctx.throw(500, err)
    }

}
/**
 * 获取订单详情接口
 */
const getOrderDetail = async (ctx, next) => {
    let userId = ctx.session.userId;
    try {
        let orderId = ctx.query.orderId
        let user = await Dumall_users.findOne({
            userId: userId
        })
        let result = {
            resultCode: "000000",
            msg: '请求成功',
            info: {
                orderId: orderId
            }
        }
        for (let index = 0; index < user.orderList.length; index++) {
            let element = user.orderList[index];
            if (element.orderId == orderId) {
                result.info.orderTotal = element.orderTotal
            }
        }
        ctx.body = result
    } catch (err) {
        ctx.throw(500, err)
    }
}


module.exports = {
    queryCartList,
    changeProductNum,
    removeProduct,
    selectProduct,
    queryCartCount,
    addcart,
    createOrder,
    getOrderDetail
}
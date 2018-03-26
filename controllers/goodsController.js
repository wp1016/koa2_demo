/*
 * @Author: wangpan 
 * 商品接口列表
 * @Date: 2018-03-15 14:41:06 
 * @Last Modified by: wangpan
 * @Last Modified time: 2018-03-23 11:28:23
 */

const models = require('../mongoose/models');
const Dumall_users = models.dumall_users;
const Dumall_goods = models.dumall_goods;
/**
 * 商品列表接口
 */
const goodsList = async (ctx, next) => {
    let payLoad = ctx.query
    let sort = payLoad.sort
    let startPrice = payLoad.startPrice
    let endPrice = payLoad.endPrice
    let goods
    ctx.body = {
        page: {},
    }
    if (endPrice) {
        goods = Dumall_goods.find({
            salePrice: {
                $gte: parseInt(startPrice) || 0,
                $lte: parseInt(endPrice)
            }
        }).skip((parseInt(payLoad.page) - 1) * parseInt(payLoad.pageSize)).limit(parseInt(payLoad.pageSize));
    } else {
        goods = Dumall_goods.find({
            salePrice: {
                $gte: parseInt(startPrice) || 0,
            }
        }).skip((parseInt(payLoad.page) - 1) * parseInt(payLoad.pageSize)).limit(parseInt(payLoad.pageSize));
    }
    if (sort == 1 || sort == -1) {
        goods.sort({
            'salePrice': sort
        })
    }
    try {
        ctx.body.page.total = await Dumall_goods.count()
        ctx.body.page.pageSize = parseInt(payLoad.pageSize)
        ctx.body.page.page = parseInt(payLoad.page)
        ctx.body.page.totalPage = Math.ceil(ctx.body.page.total / payLoad.pageSize)
        ctx.body.resultCode = '000000';
        ctx.body.msg = '请求成功'
        ctx.body.result = await goods.find({})
    } catch (err) {
        ctx.throw(500, err)
    }
}



module.exports = {
    goodsList
}
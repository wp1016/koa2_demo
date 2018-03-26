/*
 * @Author: wangpan 
 * 地址接口列表
 * @Date: 2018-03-15 14:40:48 
 * @Last Modified by: wangpan
 * @Last Modified time: 2018-03-23 11:45:14
 */

const models = require('../mongoose/models')
const Dumall_users = models.dumall_users

/**
 * 获取地址列表
 */
const queryUserAddress = async (ctx, next) => {
    let userId = ctx.session.userId;
    try {
        let users = await Dumall_users.findOne({
            userId: userId
        })
        if (users) {
            ctx.body = {
                resultCode: "000000",
                msg: "请求成功",
                data: users.addressList
            }
        }
    } catch (err) {
        ctx.throw(500, err)
    }

}

/**
 * 添加新地址
 */
const addAddress = async (ctx, next) => {
    let userId = ctx.session.userId || "100000077";
    let payload = ctx.request.body
    try {
        let user = await Dumall_users.findOne({
            userId: userId
        });

        let addressId = user.addressList[user.addressList.length - 1].addressId
        let result = await Dumall_users.update({
            userId: userId
        }, {
            $push: {
                addressList: {
                    addressId: parseInt(addressId) + 1+'',
                    userName: payload.userName,
                    streetName: payload.streetName,
                    postCode: payload.postCode||"",
                    tel: payload.tel,
                    isDefault: false
                }
            }
        })
        ctx.body = {
            resultCode: "000000",
            msg: "添加成功"
        }
    } catch (err) {
        ctx.throw(500, err)
    }
}
/**
 *删除地址 
 */
const removeAddress = async (ctx, next) => {
    let userId = ctx.session.userId;
    let payload = ctx.request.body
    let addId = payload.addId;
    if (addId) {
        try {
            await Dumall_users.update({
                userId: userId,
            }, {
                $pull: {
                    addressList: {
                        "addressId": addId
                    }
                }
            })
            ctx.body = {
                resultCode: '000000',
                msg: '删除成功'
            }
        } catch (err) {
            ctx.throw(500, err)
        }
    } else {
        ctx.body = {
            resultCode: '000001',
            msg: '必传参数不能为空'
        }
    }
}

/**
 * 设置默认地址
 */
const setDefault = async (ctx, next) => {
    let userId = ctx.session.userId
    let payload = ctx.request.body
    let addId = payload.addId
    try {
        let user = await Dumall_users.findOne({
            userId: userId
        })
        for (let index = 0; index < user.addressList.length; index++) {
            let element = user.addressList[index];
            element.isDefault = false
            if (element.addressId == addId) {
                element.isDefault = true
            }
        }
        user.markModified('addressList');
        user.save()
        ctx.body = {
            resultCode: "000000",
            msg: '设置成功'
        }
    } catch (err) {
        ctx.throw(500, err)
    }
}


module.exports = {
    queryUserAddress,
    addAddress,
    removeAddress,
    setDefault
}
/*
 * @Author: wangpan 
 * 用户信息控制器
 * @Date: 2018-03-16 19:53:36 
 * @Last Modified by: wangpan
 * @Last Modified time: 2018-03-22 15:29:09
 */

const models = require('../mongoose/models');
const Dumall_users = models.dumall_users;

/**
 * 登录
 */
const logIn = async (ctx, next) => {
    let userId = ctx.session.userId
    if (userId) {
        ctx.body = {
            status: "0",
            msg: '您已登录，请勿重复登录',
            resultCode: "000002"
        }
        return
    }
    let payload = ctx.request.body;
    try {
        let userName = await Dumall_users.findOne({
            userName: payload.userName,
        });
        if (userName) {
            let userInfo = await Dumall_users.findOne({
                userName: payload.userName,
                userPwd: payload.userPwd,
            }).lean();
            if (userInfo) {
                ctx.cookies.set("userId", userInfo.userId)
                ctx.session = {
                    userId: userInfo.userId
                }
                ctx.body = {
                    status: "0",
                    msg: "登录成功",
                    info: {
                        userId: userInfo.userId,
                        userName: userInfo.userName
                    },
                    resultCode: "000000"
                }
            } else {
                ctx.body = {
                    status: "1",
                    msg: "密码错误",
                    resultCode: "000002"
                }
            }
        } else {
            ctx.body = {
                status: "1",
                msg: "用户名不存在",
                resultCode: "000001"
            }
        }
    } catch (err) {
        ctx.throw(500, err)
    }
}

/**
 * 登出
 */
const logOut = async (ctx, next) => {
    ctx.cookies.set('userId', {
        maxAge: -1
    });
    ctx.session = {}
    ctx.body = {
        resultCode: "000000",
        msg: "登出成功"
    }
}
/**
 * 验证登录
 */
const verifyUserId = async (ctx, next) => {
    let userId = ctx.session.userId;
    if (userId) {
        try {
            let user = await Dumall_users.findOne({
                userId: userId
            })
            ctx.body = {
                resultCode: "000000",
                status: "1",
                msg: "已登录",
                info: {
                    userId: userId,
                    userName: user.userName
                }
            }
        } catch (err) {
            ctx.throw(500, err)
        }

    } else {
        ctx.body = {
            resultCode: "000001",
            status: "0",
            msg: "您尚未登录"
        }
    }
}


module.exports = {
    logIn,
    logOut,
    verifyUserId,
}
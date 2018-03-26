/*
 * @Author: wangpan 
 * session验证中间件
 * @Date: 2018-03-22 15:12:47 
 * @Last Modified by:   wangpan 
 * @Last Modified time: 2018-03-22 15:12:47 
 */

const config = require("../config")


const verifySession = async (ctx, next) => {
    let url = ctx.url.split('?')[0].substr(7);
    if (config.whiteList.indexOf(url) > -1) {
        await next()
    } else {
        if (ctx.session.userId) {
            await next()
        } else {
            ctx.throw(401)
        }
    }
}

module.exports = verifySession
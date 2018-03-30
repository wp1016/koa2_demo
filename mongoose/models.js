/*
 * @Author: wangpan 
 * 数据库模型定义
 * @Date: 2018-03-15 14:37:30 
 * @Last Modified by: wangpan
 * @Last Modified time: 2018-03-29 15:36:41
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schemas = require("./schemas");
const goodsSchema = new Schema(schemas.goodsSchema)
const cartSchema = new Schema(schemas.cartSchema)

const dumall_goods = mongoose.model('dumall_goods', goodsSchema);
const dumall_users = mongoose.model('dumall_users', cartSchema);
mongoose.connect("mongodb://admin:admin@localhost/dumall",(err)=>{
    if(err){
        console.log("链接失败");
    }else{
        console.log("数据库链接成功");
    }
});
mongoose.connection.on('disconnected', () => {
    console.log('数据库链接断开');
})

module.exports = {
    dumall_goods,
    dumall_users
}
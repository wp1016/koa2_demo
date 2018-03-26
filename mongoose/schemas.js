/*
 * @Author: wangpan 
 * 数据库Schema结构
 * @Date: 2018-03-15 14:38:12 
 * @Last Modified by: wangpan
 * @Last Modified time: 2018-03-23 11:10:03
 */

const goodsSchema = { //商品模型
    productId: String,
    productName: String,
    salePrice: Number,
    productImage: String,
    productUrl: String
}

const cartSchema = { //用户模型
    userId: String,
    userName: String,
    userPwd: String,
    orderList: Array,
    cartList: [{
        productId: {type:String},
        productImage: {type:String},
        salePrice: {type:String},
        productName: {type:String},
        productNum: {type:Number},
        checked: {type:String}
    }],
    addressList: [{
        _id:false,
        addressId:{type:String},
        userName:{type:String},
        streetName:{type:String},
        postCode:{type:String},
        tel:{type:String},
        isDefault:{type:Boolean}
    }]
}


module.exports={
    goodsSchema,
    cartSchema
}
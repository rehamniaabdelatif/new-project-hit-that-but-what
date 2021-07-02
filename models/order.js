const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    user: String,
    product: String,
    price: Number,
    stockQuantity: Number
})

module.exports = mongoose.model('Order', OrderSchema)
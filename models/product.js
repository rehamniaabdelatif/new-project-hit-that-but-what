const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    title: String,
    description: String,
    state: String,
    photo: String,
    price: Number,
    oldPrice: Number,
    stockQuantity: Number,
})

module.exports = mongoose.model('Product', ProductSchema)
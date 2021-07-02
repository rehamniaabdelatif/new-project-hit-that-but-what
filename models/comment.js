const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: String,
    productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    productTitle: String,
    comment: String
})

module.exports = mongoose.model('Comment', CommentSchema)
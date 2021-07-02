const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    path: {type: String, unique: true, required: true}
})

module.exports = mongoose.model('Photo', CategorySchema)
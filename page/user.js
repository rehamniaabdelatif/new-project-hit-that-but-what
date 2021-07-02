const app = require('express').Router()

const User = require('../models/user')
const Order = require('../models/order')

app.get('/profile/:id', async function(req, res) {
    let foundUser = await User.findOne({_id: req.decoded._id})
    res.render('user/index', {user: foundUser, orders: await Order.find({userId: req.decoded._id})})
});

module.exports = app
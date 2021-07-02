const app = require('express').Router()

const Product = require('../models/product')
const Comment = require('../models/comment')

// middlewares
const auth = require('../middlewares/auth')

app.get('/', async (req, res) => {
    let products = await Product.find()
    res.render('index', {products})
})

app.get('/signIn-Up', auth, (req, res) => {
    res.render('signIn-Up')
})

app.get('/404', (req, res) => {
    res.render('404')
})

app.get('/comment/:id', async (req, res) => {
    try {
        let comments = await Comment.find({productId: req.params.id})
        res.render('product', {
            comments: comments,
            product: await Product.findById({_id: req.params.id}),
        }) 
    } catch (error) {
        console.log(error.message)
    }
   
    //res.render('user/index', {user: foundUser, orders: await Order.find({userId: req.decoded._id})})
});

module.exports = app
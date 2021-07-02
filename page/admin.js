const app = require('express').Router()

// models for product 
const Order = require('../models/order')
const User = require('../models/user')
const Product = require('../models/product')
const Category = require('../models/category')


app.get('/', async (req, res) => {
    try {
        // Searching for a user in the database ( mongodb )
        let count = {
            user: await User.count(),
            product: await Product.count(),
            order: await Order.count(),
        }
        let orders = await Order.find()
        count.orders = orders
        if (count){
            // Send users data
            res.render('admin/',count)
        }
    } catch (error) {
        // There is an error of some kind status 500
        
    }
});

app.get('/product', async (req, res) => {
    res.render('admin/product', {
        products: await Product.find(),
        categorys: await Category.find()
    })
})

app.get('/users', async (req, res) => {
    try {
        let users = await User.find()
        res.render('admin/users', {users})
    } catch (error) {
        res.render('404')
    }
    
})

app.get('/category', async (req, res) => {
    try {
        let categorys = await Category.find()
        res.render('admin/category', {categorys})
    } catch (error) {
        res.render('404')
    }
})
app.get('/addProduct', async (req, res) => {
    try {
        let categorys = await Category.find()
        res.render('admin/addProduct', {categorys})
    } catch (error) {
        res.render('404')
    }
})

module.exports = app
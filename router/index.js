const router = require('express').Router()

// models
const Order = require('../models/order')
const User = require('../models/user')
const Product = require('../models/product')

// This is just an object to organize the response message
const resMessage = require('../responseMessage')

router.get('/', async (req, res) => {
    try {
        // Searching for a user in the database ( mongodb )
        let count = {
            user: await User.count(),
            product: await Product.count(),
            order: await Order.count(),
        }
        if (count){
            // Send users data
            res.json({
                status: true,
                number : count
            })

        }
    } catch (error) {
        
        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

router.get('/orders', async (req, res) => {
    try {
        // Searching for a user in the database ( mongodb )
        let orders = await Order.find()
        if (orders){
            // Send users data
            res.json({
                status: true,
                orders : orders
            })

        }
    } catch (error) {
        
        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

module.exports = router
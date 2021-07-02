const router = require('express').Router()

// model
const Basket = require('../models/basket')

// middlewares
const verifyToken = require('../middlewares/verify-token')

// This is just an object to organize the response message
const resMessage = require('../responseMessage')

router.post('/basket', verifyToken, async (req, res) => {
    try {
        let basket = new Basket()
        basket.user = req.body.user
        basket.product = req.body.product
        basket.quantity = req.body.quantity

        // Create new basket in the database ( mongodb )
        let resalt = await basket.save()

        // scearte new category success
        res.json({
            status: true,
            basket: resalt
        })

    }catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

// get req - get all basket 
router.get('/baskets', verifyToken, async (req, res) => {
    try {
        // get all basket from database ( mongodb )
        let baskets = await Basket.find({user: req.decoded._id})

        res.json({
            status: true,
            baskets : baskets
        })

    }catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})
router.delete('/basket/:id', verifyToken, async (req, res) => {
    try {
        // get all basket from database ( mongodb )
        let baskets = await Basket.findOneAndDelete({_id: req.params.id, user: req.decoded._id })

        res.json({
            status: true,
            baskets : baskets
        })

    }catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})


module.exports = router

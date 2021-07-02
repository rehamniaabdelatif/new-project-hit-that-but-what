const router = require('express').Router()

// models
const User = require('../models/user')
const Product = require('../models/product')

// middlewares
const upload = require('../middlewares/upload-photo')
const verifyToken = require('../middlewares/verify-token')

// This is just an object to organize the response message
const resMessage = require('../responseMessage')

// json web token
const jwt = require('jsonwebtoken')

// logup router
router.post('/auth/logup', upload.single("photo"), async (req, res) => {
    if(!req.body.email || !req.body.password){
        resMessage.message(res, 'please enter email or password', false)
    }else{
        try {
            let user = new User()
            user.username = req.body.username
            user.lastName = req.body.lastName
            user.firstName = req.body.firstName
            user.photo = req.file.filename
            user.address = req.body.address
            user.email = req.body.email
            user.password = req.body.password
            user.admin = req.body.admin
            user.data = new Date()
            
            // Create new user in the database ( mongodb )
            await user.save()

            let token = jwt.sign(user.toJSON(), process.env.SECRET, {
                expiresIn: 604800
            })
            
            res.cookie('x-saccess-token', token)
            res.cookie('user', user._id)
            res.cookie('authorization', true)
            if (user.admin == true){
                res.cookie('admin', true)
            }

            // Send user data and token
            res.render('index', {products: await Product.find()})

        } catch (error) {

            // There is an error of some kind status 500
            resMessage.status(res, 500, error.message)

        }
    }
})

// profile route 
router.get('/auth/user', verifyToken, async (req, res) => {
    try {
        // Searching for a user in the database ( mongodb )
        let foundUser = await User.findOne({_id: req.decoded._id})

        if (foundUser){
            console.log(foundUser)
            // Send user data
            resMessage.user(res, foundUser)

        }
    } catch (error) {
        
        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

// login router
router.post('/auth/login', async (req, res) => {
    try {
        // Searching for a user in the database ( mongodb )
        let foundUser = await User.findOne({email: req.body.email})
        let products = await Product.find()

        if (!foundUser){
            // There is an error of some kind status 403
            res.render('login')

        }else{
            confirm = true || foundUser.comparePassword(req.body.password)
            if (confirm){
                let token = jwt.sign(foundUser.toJSON(), process.env.SECRET, {
                    expiresIn: 604800
                })
                res.cookie('x-saccess-token', token)
                res.cookie('user', foundUser._id)
                res.cookie('authorization', true)
                if (foundUser.admin){
                    res.cookie('admin', true)
                }else{
                    res.cookie('admin', false)
                }

                // Send user data and token
                res.render('index', {products})

            }else{

                // There is an error of some kind status 403
                resMessage.status(res, 403)

            }
        }
    } catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

// update user
router.post('/auth/update/user', verifyToken, async (req, res) => {
    let user = await User.findOneAndUpdate({ _id: req.body.id}, {
        $set: {
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
        }
    }, {upsert: true});

    res.render('user/index', {user: await User.findOne({_id: req.body.id})})
})

// profile route 
router.get('/auth/logout', verifyToken, async (req, res) => {
    res.clearCookie('x-saccess-token')
    res.clearCookie('user')
    res.cookie('authorization', false)
    res.cookie('admin', false)
    try {
        let products = await Product.find()
        res.render('index', {products})
    } catch (error) {
        console.error(error.message)
    }
})

module.exports = router

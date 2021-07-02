const express = require('express')
const app = express()

const User = require('../models/user')
const verifyToken = require('../middlewares/verify-token')

// This is just an object to organize the response message
const resMessage = require('../responseMessage')

module.exports = app.use(verifyToken, async (req, res, next) => {
    try {
        console.log(req.decoded._id)
        let foundUser = await User.findOne({
            _id: req.decoded._id,
            admin: true
        })

        console.log(foundUser)

        if(foundUser){
            //resMessage.message(res, 'good')
            next()
        }else{
            // this not an admin
            res.render('login')
        }
            

    } catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)
        
    }
})



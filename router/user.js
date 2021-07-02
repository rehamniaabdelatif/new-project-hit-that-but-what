const router = require('express').Router()

// models
const User = require('../models/user')

// middlewares
const upload = require('../middlewares/upload-photo')

// This is just an object to organize the response message
const resMessage = require('../responseMessage')

// json web token
const jwt = require('jsonwebtoken')

// get all user

router.post('/user', upload.single("photo"), async (req, res) => {
    if(!req.body.email || !req.body.password){
        resMessage.message(res, 'please enter email or password', false)
    }else{
        try {
            let user = new User()
            user.username = req.body.username
            user.lastName = req.body.lastName
            user.firstName = req.body.firstName
            user.photo = req.file.filename
            user.admin = req.body.admin
            user.address = req.body.address
            user.email = req.body.email
            user.password = req.body.password
            user.data = new Date()
            
            // Create new user in the database ( mongodb )
            resilta = await user.save()

            let token = jwt.sign(user.toJSON(), process.env.SECRET, {
                expiresIn: 604800
            })
            
            res.json({
                status: true,
                user: resilta
            })

        } catch (error) {

            // There is an error of some kind status 500
            resMessage.status(res, 500, error.message)

        }
    }
})
router.get('/users', async (req, res) => {
    try {
        // Searching for a user in the database ( mongodb )
        let users = await User.find()

        if (users){

            // Send users data
            res.json({
                status: true,
                users : users
            })

        }
    } catch (error) {
        
        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

// delete req - delete a single category
router.delete('/user/:id', async (req, res) => {
    try {
        let deletedUser = await User.findOneAndDelete({ _id: req.params.id})
        if(deletedUser){
            // delete category successfully
            res.json({
                status: true,
                data: deletedUser
            })

        }
    }catch (error) {

        // There is an error of some kind status 500
       resMessage.status(res, 500, error.message)

    }
})

module.exports = router
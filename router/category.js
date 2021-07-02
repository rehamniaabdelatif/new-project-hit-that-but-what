const router = require('express').Router()
const Category = require('../models/category')
const verifyAdmin = require('../middlewares/verify-admin')

// This is just an object to organize the response message
const resMessage = require('../responseMessage')

// post req
router.post('/category', /*verifyAdmin,*/async (req, res) => {
    try {
        let category = new Category()
        category.title = req.body.title

        // Create new category in the database ( mongodb )
         result = await category.save()

        // scearte new category success
        res.json({
            status: true,
            data: result
        })

    }catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

// get api
router.get('/categorys', async (req, res) => {
    try {
        let categorys = await Category.find()

        res.json({
            status: true,
            categorys : categorys
        })

    }catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
});

// get category for product 
router.get('/category/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        let category = await Category.findOne({ _id: req.params.id})

        if(category){

            res.json({
                status: true,
                message: 'successfully',
                category: category.title,
            })
        }else{
            resMessage(res, 'not successfully')
        }
    }catch (error) {

       // There is an error of some kind status 500
       resMessage.status(res, 500, error.message)

    }
})


// delete req - delete a single category
router.delete('/category/:id', /*verifyAdmin,*/async (req, res) => {
    try {
        let deletedCategory = await Category.findOneAndDelete({ _id: req.params.id})
        if(deletedCategory){
            // delete category successfully
            resMessage.message(res, 'successfully')

        }
    }catch (error) {

        // There is an error of some kind status 500
       resMessage.status(res, 500, error.message)

    }
})


module.exports = router



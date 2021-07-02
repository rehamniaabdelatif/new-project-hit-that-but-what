const router = require('express').Router()
const upload = require('../middlewares/upload-photo')
const verifyAdmin = require('../middlewares/verify-admin')

const Product = require('../models/product')
const Category = require('../models/category')
const Basket = require('../models/basket')
const Order = require('../models/order')
const Comment = require('../models/comment')

// This is just an object to organize the response message
const resMessage = require('../responseMessage')
const verifyToken = require('../middlewares/verify-token')


// post req - create a new product
router.post('/product', verifyAdmin, upload.single("photo"), async (req, res) => {
    try {
        let product = new Product()

        product.category = req.body.category
        product.title = req.body.title
        product.description = req.body.description
        product.photo = req.file.filename
        product.price = req.body.price
        product.oldPrice = req.body.oldPrice
        product.stockQuantity = req.body.stockQuantity
        product.state = req.body.state

        // Create new product in the database ( mongodb )
        await product.save()

        res.render('admin/product', {
            products: await Product.find(),
            categorys: await Category.find()
        })
    
    } catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

// get req - get all product 
router.get('/products', async (req, res) => {
    try {
        // get all product from database ( mongodb )
        let products = await Product.find()
        res.json({
            status: true,
            products : products
        })
    }catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

// get req - get a single product
router.get('/product/:id', async (req, res) => {
    try {
        let product = await Product.findOne({ _id: req.params.id});

        res.json({
            status: true,
            product : product
        })

    }catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

// put req - update a single product
router.post('/product/update/', verifyAdmin, async (req, res) => {
    try {
        console.log(req.body)
        let product = await Product.findOneAndUpdate({ _id: req.body.id}, {
            $set: {
                category: req.body.category,
                title : req.body.title,
                description : req.body.description,
                price : req.body.price,
                oldPrice : req.body.oldPrice,
                stockQuantity : req.body.stockQuantity,
                state: req.body.state
            }
        }, {upsert: true});

        res.render('admin/product', {
            products: await Product.find(),
            categorys: await Category.find()
        })

    }catch (error) {
        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)
    }
})


// delete req - delete a single product

router.delete('/product/:id', verifyAdmin, async (req, res) => {
    try {
        let deletedProduct = await Product.findOneAndDelete({ _id: req.params.id});
        if(deletedProduct){

            // delete successfully the product
            resMessage.message(res, 'successfully')
        }
    }catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

router.post('/search', async (req, res) => {
    try {
        res.render('index', {
            products: await Product.find({ title: req.body.search}),
        })
    }catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})

router.get('/buy', verifyToken, async (req, res) => {
    let baskets = await Basket.find({user: req.decoded._id})
    console.log(baskets)
    let buy = 0

    for (let i = 0; i < baskets.length; i++ ){
        let product = await Product.findById(baskets[i].product)
        if( (product.stockQuantity-baskets[i].quantity) >= 0){
            let order = new Order()
            order.userId = req.decoded._id
            order.user = req.decoded.username
            //let p = await Product.findById(product)
            order.product = product.title
            order.price = product.price
            order.stockQuantity = baskets[i].quantity
            
            await Product.findOneAndUpdate({ _id: product}, {
                $set: {
                    stockQuantity : product.stockQuantity-baskets[i].quantity,
                }
            }, {upsert: true});


            await order.save()

            buy += Number(product.price)
        }else{
            res.json({
                status: false,
                message: 'you dont have quantity for this product'
            })
        }
    }


    /*baskets.forEach(async (basket) => {
        let product = await Product.findById(basket.product)
        console.log(product)
        if(product.stockQuantity > 0){
            buy += Number(product.price)
            console.log(buy)
        }
    })*/

})

router.post('/comment', verifyToken, async (req, res) => {
    try {
        let comment = new Comment()
        comment.user = req.decoded._id
        comment.username = req.decoded.username
        comment.productId = req.body.productId
        comment.productTitle = req.body.title
        comment.comment = req.body.comment
        console.log(comment)
        let resalt = await comment.save()

        res.render('product', {
            comments: await Comment.find({productId: req.body.productId}),
            product: await Product.findById({_id: req.body.productId}),
        }) 
    }catch (error) {

        // There is an error of some kind status 500
        resMessage.status(res, 500, error.message)

    }
})


module.exports = router;
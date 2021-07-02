const jwt = require('jsonwebtoken')

const Product = require('../models/product')


module.exports = (req, res, next) => {
    let token = req.cookies['x-saccess-token'] || req.headers['authorization']
    let checkBearer = 'Bearer '

    if(token){

        if(token.startsWith(checkBearer)){
            token = token.slice(checkBearer.length, token.length)
        }
        
        jwt.verify(token, process.env.SECRET,async  (err, decoded) => {
            if (err){
                res.render('login')
            } else {
                try {
                    let products = await Product.find()
                    res.render('index', {products})
                } catch (error) {
                    res.render('login')
                }
            }
        })
    }else{
        res.render('login')
    }
}
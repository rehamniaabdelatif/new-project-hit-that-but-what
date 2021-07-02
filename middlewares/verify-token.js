const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){
    let token = req.cookies['x-saccess-token'] || req.headers['authorization']
    let checkBearer = 'Bearer '

    if(token){

        if(token.startsWith(checkBearer)){
            token = token.slice(checkBearer.length, token.length)
        }
        
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err){
                res.render('login')
            } else {
                req.decoded = decoded
                //console.log(decoded)
                next()
            }
        })
    }else{
        res.render('login')
    }
}
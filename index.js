const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// middlewares
const verifyToken = require('./middlewares/verify-token')
const verifyAdmin = require('./middlewares/verify-admin')
const token = require('./middlewares/auth')

dotenv.config()

const app = express()

// set the view engine to ejs
app.set('view engine', 'ejs')

// connect to the mongodb 
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true}, (error)=>{
    if (error){
        console.log(error)
    }else{
        console.log('connected to the database')
    }
})


// midlewares
app.use(cookieParser())
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


// static file 
app.use('/uploads', express.static('./uploads'))
app.use('/',express.static('./public'))


// page ----------------------------------------------
const admin = require('./page/admin')
const user = require('./page/user')
const anonymous = require('./page/anonymous')

app.use('/', anonymous)
app.use('/user',verifyToken, user)
app.use('/admin',verifyAdmin, admin)

// ---------------------------------------------------


// ------------------------------------------------------
// require apis
const productRouter = require('./router/product')
const categoryRoute = require('./router/category')
const userRouter = require('./router/auth')
const usersRouter = require('./router/user')
const apiIndex = require('./router/')
const baskets = require('./router/basket')

// prefix /api
app.use('/api', productRouter)
app.use('/api', categoryRoute)
app.use('/api', userRouter)
app.use('/api', verifyAdmin, usersRouter)
app.use('/api', verifyAdmin, apiIndex)
app.use('/api', baskets)
// --------------------------------------------------------


// server listen 
app.listen(process.env.PORT, function(err){
    if(err)
        console.log(err.message);
    else
        console.log(`http://localhost:${process.env.PORT}`)
})

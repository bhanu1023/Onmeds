const express = require('express')
const session = require('express-session')
const path = require('path')
const cors = require('cors')
const redis = require('redis')
const redisClient  = redis.createClient()
const redisStore = require('connect-redis')(session)
var cookieParser = require('cookie-parser')
var bodyParser  = require('body-parser')
const sequelize = require('./db/database')
const Product = require('./models/product')
const Cart = require('./models/cart')
const CartItems = require('./models/cart-item')
const User = require('./models/user')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const userRouter = require('./routes/user')
require('dotenv').config()

const app = express()

//checking and loggin in redis client
redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

//creating express session confin with redis as main storage of sessions
var sess = {
    secret: process.env.EXPRESS_SESSION_SECRET,
    name: '_redis',
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: { secure: false },
    store: new redisStore({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT,client: redisClient, ttl: process.env.REDIS_TTL}),
}

//middlewares..
app.use(session(sess))
app.use(cors())
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//serving react static files in build folder
app.use(express.static(path.join(__dirname, 'build')))

//api routes
app.use("/api",productRouter)
app.use("/api",cartRouter)
app.use("/api",userRouter)

//serving build index.html for all paths except apis
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})



User.hasOne(Cart); //one to one relationship between user and cart
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through: CartItems}); //many to many relationship bw cart and product through cartitems
Product.belongsToMany(Cart,{through: CartItems})


//sequelize initialize
sequelize.sync()
.then(result=>{
    app.listen(process.env.PORT,()=>{ //start server only when db is running
        console.log(`Server is up at ${process.env.PORT}`)
    })
})
.catch(err=>{
    console.log(err)
})
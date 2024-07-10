
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoose from './config/database.js';
import handlebars from 'express-handlebars';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import __dirname from './utils.js';
import cors from 'cors'
import viewsRouter from './routes/views.router.js'
import sessionsRouter from './routes/api/sessions.router.js'
import productsRouter from './routes/product.router.js'
import cartsRouter from './routes/cart.router.js'

const app = express()
const PORT = 8080

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

//Routes
app.use('/', viewsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
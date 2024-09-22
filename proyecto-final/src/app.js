
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
import cors from 'cors';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/api/sessions.router.js';
import usersRouter from './routes/user.router.js';
import productsRouter from './routes/product.router.js';
import cartsRouter from './routes/cart.router.js';
import ticketRouter from './routes/ticket.router.js';
import testRouter from './routes/test.router.js';
import errorHandler from './middleware/errors.js';
import swaggerJsdoc from 'swagger-jsdoc';
import SwaggerUiExpress from 'swagger-ui-express';

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

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion",
            description: "Documentacion de API E-Commerce"
        },
    },
    apis: [`src/docs/products/products.yaml`, `src/docs/carts/carts.yaml`]
};

const specs = swaggerJsdoc(swaggerOptions);

//Routes
app.use('/', viewsRouter);
app.use('/api/test', testRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketRouter);
app.use('/apidocs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs));
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
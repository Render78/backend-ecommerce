import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import indexRouter from './routes/index.router.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
// import chatRouter from './routes/chat.router.js'

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://Julian:12345@cluster0.e9to8uh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => { console.log("Conectado a la base de datos") })
    .catch(error => { console.error("Error en la conexion", error) });

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/', indexRouter);
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
// app.use('/api/chat', chatRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
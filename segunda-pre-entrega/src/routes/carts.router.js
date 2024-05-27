import { Router } from "express"
import cartModel from "../dao/models/cart.model.js"
import mongoose from "mongoose";

const router = Router();

router.post('/post', async (req, res) => {
    try {
        // Crea un nuevo carrito con el modelo
        const newCart = new cartModel();

        // Guarda el carrito en la base de datos
        await newCart.save();

        // Devuelve una respuesta con el carrito creado
        return res.status(201).json(newCart);
    } catch (error) {
        // Maneja los errores
        console.error('Error al crear el carrito:', error);
        return res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        // Obtiene el ID del carrito de los parámetros de la URL
        const cartId = req.params.cid;

        // Busca el carrito por su ID en la base de datos
        const cart = await Cart.findById(cartId).populate('products.product', 'name price');

        // Si no se encuentra el carrito, devuelve un error
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Devuelve el carrito encontrado como respuesta
        return res.status(200).json(cart);
    } catch (error) {
        // Maneja los errores
        console.error('Error al obtener el carrito:', error);
        return res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.put("/", (req, res) => {
    res.send("Put request to the homepage")
})

router.delete("/", (req, res) => {
    res.send("Delete request to the homepage")
})

export default router;
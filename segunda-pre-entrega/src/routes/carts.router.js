import { Router } from "express"
import cartModel from "../dao/models/cart.model.js"
import productsModel from "../dao/models/products.model.js";
import mongoose from "mongoose";

const router = Router();

router.post('/post', async (req, res) => {
    try {
        const newCart = new cartModel();

        await newCart.save();

        return res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        return res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/get/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        const cart = await cartModel.findById(cartId).populate({
            path: 'products.product',
            select: 'title price',
            model: productsModel
        });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

export default router;
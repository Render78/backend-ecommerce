const express = require("express");
const router = express.Router();
const CartManager = require("../classes/CartManager.js");
const manager = new CartManager("./src/data/Carts.json");

router.post("/", async (req, res) => {
    try {
        const { products } = req.body;

        
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: "Se requiere un array de productos para crear un carrito" });
        }

        
        const newCart = await manager.addCart({ products });

        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al crear el carrito" });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);

        
        const cart = await manager.getCartById(cartId);

        
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener el carrito" });
    }
});

module.exports = router;
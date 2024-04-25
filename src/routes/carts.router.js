const express = require("express");
const router = express.Router();
const CartManager = require("../classes/CartManager.js");
const manager = new CartManager("./src/data/Carts.json");
const ProductManager = require("../classes/ProductManager.js");
const productManager = new ProductManager("./src/data/Products.json");

router.post("/", async (req, res) => {
    try {
        const newCart = await manager.addCart({ products: [] });

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

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser un número entero positivo" });
        }

        const cart = await manager.getCartById(cartId);

        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(item => item.product === productId);

        if (existingProductIndex !== -1) {
            // Si el producto ya existe, incrementar la cantidad
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Si el producto no existe, agregarlo al carrito
            cart.products.push({ product: productId, quantity });
        }

        await manager.saveCart([cart]); // Guardar el carrito modificado como un array con un solo elemento

        res.status(201).json({ message: "Producto agregado al carrito exitosamente" });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al agregar producto al carrito" });
    }
});

module.exports = router;
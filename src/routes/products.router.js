const express = require("express");
const router = express.Router();
const ProductManager = require("../classes/ProductManager.js");
const productManager = new ProductManager("./src/data/Products.json");

router.get("/", async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : Infinity;
        let products = await productManager.getProducts();

        if (limit < products.length) {
            products = products.slice(0, limit);
        }

        res.json(products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener los productos" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        const product = await productManager.getProductById(productId);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener el producto" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnail } = req.body;

        
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }

        
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
            status: true,
            thumbnail: thumbnail || []
        };

        
        const addedProduct = await productManager.addProduct(newProduct);

        res.status(201).json(addedProduct);
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: "Ocurrió un error al agregar el producto" });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productUpdate = req.body;

        const existingProduct = await productManager.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await productManager.updateProduct(productId, productUpdate);

        const updatedProduct = await productManager.getProductById(productId);

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: "Ocurrió un error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        // Verificar si el producto existe
        const existingProduct = await productManager.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Eliminar el producto
        await productManager.deleteProduct(productId);

        res.status(200).json({ message: "El producto fue eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Ocurrió un error al eliminar el producto" });
    }
});

module.exports = router;

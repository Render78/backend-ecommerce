import { Router } from "express";
import productsModel from "../dao/models/products.model.js";
import mongoose from "mongoose";

const router = Router();

router.get("/get", async (req, res) => {
    try {
        let products = await productsModel.find().lean();
        res.render('products', { products });
    } catch (error) {
        console.error("No se pudieron obtener los productos", error);
    }
})

router.get("/get/:pid", async (req, res) => {
    try {
        const pId = req.params.pid;

        if (!mongoose.Types.ObjectId.isValid(pId)) {
            return res.status(400).send({ status: "error", error: "ID inválido" });
        }

        const objectId = new mongoose.Types.ObjectId(pId);
        const product = await productsModel.findById(objectId);

        if (!product) {
            return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }

        res.render('getProductById', {
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            thumbnail: product.thumbnail
        });
    } catch (error) {
        console.error("No se pudo obtener el producto por ID", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

router.get("/post", async (req, res) => {
    try {
        res.render('addProduct');
    } catch (error) {
        console.error("No se pudo renderizar la vista", error);
    }
})

router.post("/", async (req, res) => {
    try {
        let { title, description, category, price, thumbnail, code, stock, status } = req.body;
        if (!title || !description || !category || !price || !thumbnail || !code || !stock || !status) {
            return res.status(400).send({ status: "error", error: "Algunos parámetros están vacíos" });
        }

        let result = await productsModel.create({ title, description, category, price, thumbnail, code, stock, status });
        res.render('addProductSuccess', { product: result.toObject() });
    } catch (error) {
        console.error("No se pudo agregar el producto", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

router.put("/:pid", async (req, res) => {
    let { pid } = req.params;

    let productToReplace = req.body;

    if (!productToReplace.title || !productToReplace.description || !productToReplace.price || !productToReplace.thumbnail || !productToReplace.code || !productToReplace.stock || !productToReplace.status) {
        res.send({ status: "error", error: "Algunos parametros estan vacios" });
    }

    let result = await productsModel.updateOne({ _id: pid }, productToReplace);

    res.send({ result: "success", payload: result });
})

router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await productsModel.deleteOne({ _id: pid });
    res.send({ result: "success", payload: result });
})

export default router;
import { Router } from "express";
import productsModel from "../dao/models/products.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        let products = await productsModel.find().lean();
        res.render('home', { products });
    } catch (error) {
        console.error("No se pudieron obtener los productos", error);
    }
})

router.get("/post", async (req, res) => {
    try {
        res.render('postProduct');
    } catch (error) {
        console.error("No se pudo renderizar la vista", error);
    }
})

router.post("/", async (req, res) => {
    try {
        let { title, description, price, thumbnail, code, stock, status } = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock || !status) {
            res.send({ status: "error", error: "Algunos parametros estan vacios" });
        }
        let result = await productsModel.create({ title, description, price, thumbnail, code, stock, status });
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error("No se pudo agregar el producto", error);
    }
})

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
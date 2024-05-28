import { Router } from "express";
import productsModel from "../dao/models/products.model.js";
import mongoose from "mongoose";

const router = Router();

//! ENDPOINTS GET

router.get("/get", async (req, res) => {
    try {
        let { limit, page, sort, query } = req.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;
        sort = sort || '';
        query = query || '';

        let filter = {};

        if (query) {
            const categoryRegex = new RegExp(`^${query}$`, 'i');
            filter = { category: categoryRegex };
        }

        let options = {
            page: page,
            limit: limit,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            lean: true
        };

        let result = await productsModel.paginate(filter, options);

        const { totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage } = result;
        const prevLink = hasPrevPage ? `${req.baseUrl}/get?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
        const nextLink = hasNextPage ? `${req.baseUrl}/get?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

        console.log(`
        Paginación:
        Total Pages: ${totalPages}
        Prev Page: ${prevPage}
        Next Page: ${nextPage}
        Current Page: ${currentPage}
        Has Prev Page: ${hasPrevPage}
        Has Next Page: ${hasNextPage}
        Prev Link: ${prevLink}
        Next Link: ${nextLink}
        `);

        res.render('products', { products: result.docs, prevLink: prevLink, nextLink, nextLink });
    } catch (error) {
        console.error("No se pudieron obtener los productos", error);
        res.status(500).json({
            status: 'error',
            message: "No se pudieron obtener los productos"
        });
    }
});

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

        res.render('productDetail', {
            id: product._id,
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock
        });
    } catch (error) {
        console.error("No se pudo obtener el producto por ID", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

//! ENDPOINTS POST

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


//! ENDPOINTS PUT
router.get("/put", async (req, res) => {
    try {
        res.render('updateProduct');
    } catch (error) {
        console.error("No se pudo renderizar la vista", error);
    }
});

router.put("/put/:pid", async (req, res) => {
    let { pid } = req.params;
    let productToReplace = req.body;

    if (!productToReplace.title || !productToReplace.description || !productToReplace.category || !productToReplace.price || !productToReplace.thumbnail || !productToReplace.code || !productToReplace.stock || !productToReplace.status) {
        return res.status(400).json({ status: "error", error: "Algunos parametros estan vacios" });
    }

    try {
        let result = await productsModel.updateOne({ _id: pid }, productToReplace);
        if (result.nModified === 0) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }
        res.json({ status: "success", payload: result });
    } catch (error) {
        console.error("Error actualizando el producto:", error);
        res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
});

//!ENDPOINTS DELETE
router.get("/delete", async (req, res) => {
    try {
        res.render('deleteProduct');
    } catch (error) {
        console.error("No se pudo renderizar la vista", error);
    }
})

router.delete("/delete/:pid", async (req, res) => {
    let { pid } = req.params;
    let result = await productsModel.deleteOne({ _id: pid });
    res.send({ result: "success", payload: result });
})

export default router;
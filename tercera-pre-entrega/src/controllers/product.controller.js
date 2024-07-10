import Product from '../dao/models/product.model.js';
import mongoose from 'mongoose';


export const listProducts = async (req, res) => {
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

        let result = await Product.paginate(filter, options);

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

        res.status(200).json({
            products: result.docs,
            pagination: {
                totalPages,
                prevPage,
                nextPage,
                currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            }
        });
    } catch (error) {
        console.error("No se pudieron obtener los productos", error);
        res.status(500).json({
            status: 'error',
            message: "No se pudieron obtener los productos"
        });
    }
};


export const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ status: "error", error: "ID inválido" });
        }

        const objectId = new mongoose.Types.ObjectId(pid);
        const product = await Product.findById(objectId);

        if (!product) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("No se pudo obtener el producto por ID", error);
        res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
};


export const addProduct = async (req, res) => {
    try {
        const { title, description, category, price, thumbnail, code, stock, status } = req.body;

        if (!title || !description || !category || !price || !thumbnail || !code || !stock || !status) {
            return res.status(400).json({ status: "error", error: "Faltan parámetros obligatorios" });
        }

        const newProduct = new Product({ title, description, category, price, thumbnail, code, stock, status });
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error al agregar el producto", error);
        res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const productToUpdate = req.body;

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ status: "error", error: "ID inválido" });
        }

        if (!productToUpdate || Object.keys(productToUpdate).length === 0) {
            return res.status(400).json({ status: "error", error: "No se proporcionaron datos para actualizar" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(pid, productToUpdate, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar el producto", error);
        res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ status: "error", error: "ID inválido" });
        }

        const deletedProduct = await Product.findByIdAndDelete(pid);

        if (!deletedProduct) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }

        res.status(200).json({ status: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el producto", error);
        res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
};

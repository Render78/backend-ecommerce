import ProductRepositoryImpl from '../repositories/product.repository.impl.js';
import { generateProductErrorInfo } from '../services/info.js';
import CustomError from "../services/CustomError.js";
import EErrors from "../services/enum.js";

const productRepository = new ProductRepositoryImpl();

export const listProducts = async (req, res) => {
  try {
    let { limit, page, sort, query } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    sort = sort || '';
    query = query || '';

    const filter = query ? { category: new RegExp(`^${query}$`, 'i') } : {};

    const options = {
      page,
      limit,
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
      lean: true
    };

    const result = await productRepository.findAll(filter, options);

    const { totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage } = result;
    const prevLink = hasPrevPage ? `products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
    const nextLink = hasNextPage ? `products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

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
    const product = await productRepository.findById(pid);

    if (!product) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    if (error.message === "Invalid ID") {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
    logger.error(`No se pudo obtener el producto por ID: ${error.message}`);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { title, description, category, price, thumbnail, code, stock, status } = req.body;
    const owner = req.user ? req.user.email : 'admin';

    if (!title || !description || !category || !price || !thumbnail || !code || !stock || !status) {

      const error = CustomError.createError({
        name: "Agregar nuevo producto",
        cause: generateProductErrorInfo({ title, description, category, price, thumbnail, code, stock, status }),
        message: "Error al querer agregar un nuevo producto",
        code: EErrors.INVALID_TYPES_ERROR
      });

      return res.status(400).json({ status: "error", error });
    }

    const newProduct = await productRepository.create({ title, description, category, price, thumbnail, code, stock, status, owner });
    res.status(201).json(newProduct);
  } catch (error) {
    logger.error(`Error al agregar el producto: ${error.message}`);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const productToUpdate = req.body;
    const user = req.user;

    if (!productToUpdate || Object.keys(productToUpdate).length === 0) {
      return res.status(400).json({ status: "error", error: "No se proporcionaron datos para actualizar" });
    }

    const product = await productRepository.findById(pid);

    if (!product) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    if (user.role === 'premium' && product.owner !== user.email) {
      return res.status(403).json({ status: "error", error: "No tienes permisos para actualizar este producto" });
    }

    const updatedProduct = await productRepository.update(pid, productToUpdate);

    if (!updatedProduct) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.message === "Invalid ID") {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
    logger.error(`Error al actualizar el producto: ${error.message}`);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const user = req.user;

    const product = await productRepository.findById(pid);

    if (!product) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    if (user.role === 'premium' && product.owner !== user.email) {
      return res.status(403).json({ status: "error", error: "No tienes permisos para eliminar este producto" });
    }

    const deletedProduct = await productRepository.delete(pid);

    if (!deletedProduct) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    res.status(200).json({ status: "success", message: "Producto eliminado exitosamente" });
  } catch (error) {
    if (error.message === "Invalid ID") {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
    logger.error(`Error al eliminar el producto: ${error.message}`);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
};

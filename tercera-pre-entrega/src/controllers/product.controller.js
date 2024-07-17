import ProductRepositoryImpl from '../repositories/product.repository.impl.js';
const productRepository = new ProductRepositoryImpl();

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

    let result = await productRepository.findAll(filter, options);

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
    const product = await productRepository.findById(pid);

    if (!product) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    if (error.message === "Invalid ID") {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
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

    const newProduct = await productRepository.create({ title, description, category, price, thumbnail, code, stock, status });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al agregar el producto", error);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const productToUpdate = req.body;

    if (!productToUpdate || Object.keys(productToUpdate).length === 0) {
      return res.status(400).json({ status: "error", error: "No se proporcionaron datos para actualizar" });
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
    console.error("Error al actualizar el producto", error);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await productRepository.delete(pid);

    if (!deletedProduct) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    res.status(200).json({ status: "success", message: "Producto eliminado exitosamente" });
  } catch (error) {
    if (error.message === "Invalid ID") {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
    console.error("Error al eliminar el producto", error);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
};

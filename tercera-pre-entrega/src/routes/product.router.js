import { Router } from 'express';
import {
    listProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = Router();

router.get('/', listProducts);
router.get('/:pid', getProductById);
router.post('/', addProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;

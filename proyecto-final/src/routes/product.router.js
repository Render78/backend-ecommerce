import { Router } from 'express';
import {
    listProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { checkRoles } from '../middleware/auth.js';
import generateMockProducts from '../mocks/products.mock.js';

const router = Router();

router.get('/mockingproducts', (req, res) => {
    const mockProducts = generateMockProducts(100)
    res.json(mockProducts);
})
router.get('/', listProducts);
router.get('/:pid', getProductById);
router.post('/', checkRoles('admin', 'premium'), addProduct);
router.put('/:pid', checkRoles('admin'), updateProduct);
router.delete('/:pid', checkRoles('admin', 'premium'), deleteProduct);


export default router;

import { Router } from 'express';
import {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    clearCart
} from '../controllers/cart.controller.js';

const router = Router();

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/product/:pid', removeProductFromCart);
router.put('/:cid/product/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);

export default router;

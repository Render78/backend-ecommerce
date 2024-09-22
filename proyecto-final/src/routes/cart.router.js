import { Router } from 'express';
import {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    clearCart,
    purchase
} from '../controllers/cart.controller.js';
import { isUserOrPremium } from '../middleware/auth.js';

const router = Router();

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', isUserOrPremium, addProductToCart);
router.delete('/:cid/product/:pid', removeProductFromCart);
router.put('/:cid/product/:pid', updateProductQuantity);
router.delete('/:cid', clearCart);
router.post('/:cid/purchase', purchase);

export default router;

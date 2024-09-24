import { Router } from "express";
import { checkRoles, isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
import {
    renderHome,
    renderLogin,
    renderRegister,
    renderCurrent,
    renderProducts,
    renderAddProduct,
    renderUpdateProduct,
    renderDeleteProduct,
    renderForgotPassword,
    renderResetPassword,
    renderProductDetail,
    renderUserManagement
} from '../controllers/views.controller.js';

const router = Router();

router.get("/", renderHome);
router.get('/products', renderProducts);
router.get('/products/:pid', renderProductDetail);
router.get('/addproduct', checkRoles('admin', 'premium'), renderAddProduct);
router.get('/updateproduct', checkRoles('admin'), renderUpdateProduct);
router.get('/deleteproduct', checkRoles('admin', 'premium'), renderDeleteProduct);
router.get('/login', isNotAuthenticated, renderLogin);
router.get('/register', isNotAuthenticated, renderRegister);
router.get('/current', isAuthenticated, renderCurrent);
router.get('/forgotPassword', isNotAuthenticated, renderForgotPassword);
router.get('/reset-password/:token', isNotAuthenticated, renderResetPassword);
router.get('/users', isAuthenticated, checkRoles('admin'), renderUserManagement);

export default router;

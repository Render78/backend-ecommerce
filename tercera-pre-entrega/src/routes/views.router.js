import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
import {
    renderHome,
    renderLogin,
    renderRegister,
    renderCurrent,
    renderProducts
} from '../controllers/views.controller.js';

const router = Router();

router.get("/", renderHome);
router.get('/products', renderProducts)
router.get('/login', isNotAuthenticated, renderLogin);
router.get('/register', isNotAuthenticated, renderRegister);
router.get('/current', isAuthenticated, renderCurrent);

export default router;

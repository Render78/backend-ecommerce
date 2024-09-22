import axios from 'axios'
import UserDTO from '../dao/dtos/user.dto.js';
import logger from '../utils/logger.js'

export const renderHome = async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        logger.error(`No se pudo renderizar la vista ${error.message}`);
    }
};

export const renderProducts = async (req, res) => {
    try {
        const response = await axios.get(`${req.protocol}://${req.get('host')}/api/products`, {
            params: req.query,
        });

        const productsData = response.data;
        const user = req.session.user;

        res.render('products', {
            products: productsData.products,
            pagination: productsData.pagination,
            cart: user ? user.cart : null
        });
    } catch (error) {
        logger.error(`No se pudo renderizar la vista de productos: ${error.message}`);
        res.status(500).render('error', { message: 'Error al cargar los productos.' });
    }
};

export const renderProductDetail = async (req, res) => {
    try {
        const { pid } = req.params;
        const response = await axios.get(`${req.protocol}://${req.get('host')}/api/products/${pid}`);
        const product = response.data;

        res.render('productDetail', {
            product
        });
    } catch (error) {
        logger.error(`No se pudo renderizar la vista del detalle: ${error.message}`);
        res.status(500).render('error', { message: 'Error al cargar el detalle del producto.' });
    }
};

export const renderAddProduct = async (req, res) => {
    try {
        res.render('addProduct');
    } catch (error) {
        logger.error(`No se pudo renderizar la vista ${error.message}`);
    }
}

export const renderUpdateProduct = async (req, res) => {
    try {
        res.render('updateProduct');
    } catch (error) {
        logger.error(`No se pudo renderizar la vista ${error.message}`);
    }
}

export const renderDeleteProduct = async (req, res) => {
    try {
        res.render('deleteProduct');
    } catch (error) {
        logger.error(`No se pudo renderizar la vista ${error.message}`);
    }
}

export const renderLogin = async (req, res) => {
    res.render('login');
};

export const renderRegister = async (req, res) => {
    res.render('register');
};

export const renderCurrent = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'No hay usuario autenticado' });
        }

        const userDTO = new UserDTO(req.session.user);
        res.render('current', { user: userDTO });
    } catch (error) {
        logger.error(`No se pudo renderizar el current ${error.message}`);
        res.status(500).json({ error: 'Error al renderizar la vista current' });
    }
};

export const renderForgotPassword = async (req, res) => {
    try {
        res.render('forgotPassword');
    } catch (error) {
        logger.error(`No se pudo renderizar la vista ${error.message}`);
        res.status(500).json({ error: 'Error al renderizar la vista' });
    }
}

export const renderResetPassword = async (req, res) => {
    const { token } = req.params;

    try {
        res.render('resetPassword', { token });
    } catch (error) {
        logger.error(`No se pudo renderizar la vista ${error.message}`);
        res.status(500).json({ error: 'Error al renderizar la vista' });
    }
}

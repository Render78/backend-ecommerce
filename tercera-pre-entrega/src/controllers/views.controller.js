import axios from 'axios'
import UserDTO from '../dao/dtos/user.dto.js';

export const renderHome = async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.log("No se pudo renderizar la vista", error);
    }
};

export const renderProducts = async (req, res) => {
    try {
        const response = await axios.get(`${req.protocol}://${req.get('host')}/api/products`);
        const productsData = response.data;

        res.render('products', {
            products: productsData.products,
            pagination: productsData.pagination
        });
    } catch (error) {
        console.log("No se pudo renderizar la vista de productos", error);
    }
};

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
        console.log("No se pudo renderizar la vista current", error);
        res.status(500).json({ error: 'Error al renderizar la vista current' });
    }
};

import UserRepositoryImpl from '../repositories/user.repository.impl.js';
import { createHash } from '../utils.js';
import CartRepositoryImpl from '../repositories/cart.repository.impl.js';
import axios from 'axios';
import logger from '../utils/logger.js';

const userRepository = new UserRepositoryImpl();
const cartRepository = new CartRepositoryImpl();

export const registerUser = async (req, res) => {
    try {
        logger.info("Nuevo usuario registrado");
        res.status(201).json({ status: "success", message: "Usuario registrado exitosamente" });
    } catch (error) {
        logger.error(`Error al registrar el usuario ${error.message}`);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

export const loginUser = async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" });
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            cart: req.user.cart
        };
        res.redirect('/current');
    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
};

export const logoutUser = async (req, res) => {
    try {
        if (req.user) {
            req.user.last_connection = new Date();
            await req.user.save();
        }

        req.session.destroy((err) => {
            if (err) return res.status(500).send('Error al cerrar sesión');
            res.redirect('/login');
        });
    } catch (err) {
        res.status(500).send('Error al cerrar sesión');
    }

};

export const failRegister = async (req, res) => {
    logger.error("Estrategia fallida");
    res.send({ error: "Falló" });

};

export const failLogin = async (req, res) => {
    res.send({ error: "Login fallido" });
};

export const githubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
};

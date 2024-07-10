import userModel from '../dao/models/user.model.js';
import { createHash } from '../utils.js';
import Cart from '../dao/classes/cart.dao.js'

const cartService = new Cart()

export const registerUser = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {        
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        
        const hashedPassword = createHash(password);
        
        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });
        
        const savedUser = await newUser.save();
        console.log("Nuevo usuario registrado:", savedUser);
        
        const newCart = await cartService.createCart();
        
        savedUser.cart = newCart._id;
        await savedUser.save();
        
        res.status(201).json({ status: "success", message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
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
        };
        console.log(req.session.user);
        res.redirect('/current');
    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
};

export const logoutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
};

export const failRegister = async (req, res) => {
    console.log("Estrategia fallida");
    res.send({ error: "Falló" });
};

export const failLogin = async (req, res) => {
    res.send({ error: "Login fallido" });
};

export const githubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
};

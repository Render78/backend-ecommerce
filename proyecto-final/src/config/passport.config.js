import passport from "passport";
import local from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import userModel from '../dao/models/user.model.js';
import { createHash } from "../utils.js";
import dotenv from 'dotenv';
import UserRepositoryImpl from "../repositories/user.repository.impl.js";
import CartRepositoryImpl from '../repositories/cart.repository.impl.js';
import CustomError from "../services/CustomError.js";
import EErrors from "../services/enum.js";
import { generateUserErrorInfo } from "../services/info.js";
import logger from '../utils/logger.js'

dotenv.config();

const userRepository = new UserRepositoryImpl();
const cartRepository = new CartRepositoryImpl();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            const { first_name, last_name, age } = req.body;
            try {
                let user = await userRepository.findUserByEmail(email);
                if (user) {
                    logger.warning(`El usuario con el email ${email} ya existe.`)
                    return done(null, false);
                }

                const hashedPassword = createHash(password);

                let role = 'user';
                if (email.endsWith('@admin.com')) {
                    role = 'admin';
                } else if (email.endsWith('@premium.com')) {
                    role = 'premium';
                }

                const newCart = await cartRepository.createCart();
                logger.info(`Nuevo carrito creado con el ID: ${newCart}`);

                const newUser = new userModel({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword,
                    cart: newCart._id,
                    role
                });

                if (!first_name || !last_name || !email || !age || !password) {
                    const errorInfo = generateUserErrorInfo({ first_name, last_name, email, age, password });
                    CustomError.createError({
                        name: "Registro de usuario",
                        cause: errorInfo,
                        message: "Error al intentar registrar un usuario",
                        code: EErrors.INVALID_TYPES_ERROR
                    });
                    logger.warning(`Error al registrar el usuario: ${errorInfo}`);
                    return done(null, false);
                }

                let result = await newUser.save();
                logger.info(`Usuario registrado exitosamente: ${email}`)
                return done(null, result);
            } catch (error) {
                logger.error(`Error al registrar el usuario: ${error.message}`)
                return done(error);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await userModel.findOne({ email });
                if (!user) {
                    logger.warning(`El usuario con el email ${email} no existe.`);
                    return done(null, false);
                }

                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    logger.warning(`Contraseña incorrecta para el usuario con el email ${email}.`);
                    return done(null, false);
                }

                user.last_connection = new Date();
                await user.save();

                logger.info(`Usuario con el email ${email} ha iniciado sesión exitosamente.`);
                return done(null, user);
            } catch (error) {
                logger.error(`Error durante el proceso de login: ${error.message}`);
                return done(error);
            }
        }
    ));

    passport.use('github', new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/api/sessions/githubcallback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                logger.info(`Perfil recibido de GitHub: ${JSON.stringify(profile)}`);

                const email = profile._json.email || `${profile.username}@github.com`;
                let user = await userModel.findOne({ email });

                if (!user) {
                    const [first_name, last_name] = profile.displayName.split(' ');

                    logger.info(`Creando nuevo usuario con los datos: First Name: ${first_name}, Last Name: ${last_name || 'N/A'}, Email: ${email}`);

                    const newUser = new userModel({
                        first_name,
                        last_name: last_name || 'N/A',
                        email,
                        age: 20,
                        password: "",
                        role: email.endsWith('@admin.com') ? 'admin' : 'user'
                    });

                    user = await newUser.save();
                    logger.info(`Nuevo usuario creado: ${JSON.stringify(user)}`);
                } else {
                    logger.info(`Usuario encontrado en la base de datos: ${JSON.stringify(user)}`);
                }

                return done(null, user);
            } catch (error) {
                logger.error(`Error en la estrategia de Passport con GitHub: ${error.message}`);
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

export default initializePassport;

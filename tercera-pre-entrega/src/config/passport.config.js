import passport from "passport";
import local from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import userModel from '../dao/models/user.model.js';
import { createHash } from "../utils.js";
import dotenv from 'dotenv';
import UserRepositoryImpl from "../repositories/user.repository.impl.js";
import CartRepositoryImpl from '../repositories/cart.repository.impl.js';
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
                    console.log("El usuario ya existe");
                    return done(null, false);
                }

                const hashedPassword = createHash(password);

                let role = 'user';
                if (email.endsWith('@admin.com')) {
                    role = 'admin';
                }

                const newCart = await cartRepository.createCart();
                console.log("Nuevo carrito creado:", newCart);

                const newUser = new userModel({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword,
                    cart: newCart._id,
                    role
                });

                let result = await newUser.save();
                return done(null, result);
            } catch (error) {
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
                    console.log("El usuario no existe");
                    return done(null, false);
                }

                console.log('Contraseña ingresada:', password);
                console.log('Contraseña almacenada:', user.password);

                const isMatch = await user.comparePassword(password);
                console.log('¿Las contraseñas coinciden?', isMatch);
                if (!isMatch) {
                    console.log("Contraseña incorrecta");
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
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
                console.log("Profile from GitHub:", profile);

                const email = profile._json.email || `${profile.username}@github.com`;
                let user = await userModel.findOne({ email });

                if (!user) {
                    const [first_name, last_name] = profile.displayName.split(' ');

                    console.log("Creating new user with data:");
                    console.log("First Name:", first_name);
                    console.log("Last Name:", last_name);
                    console.log("Email:", email);

                    const newUser = new userModel({
                        first_name,
                        last_name: last_name || 'N/A',
                        email,
                        age: 20,
                        password: "",
                        role: email.endsWith('@admin.com') ? 'admin' : 'user' // Asignar rol
                    });

                    user = await newUser.save();
                    console.log("New user created:", user);
                } else {
                    console.log("User found in database:", user);
                }

                return done(null, user);
            } catch (error) {
                console.error("Error in GitHub passport strategy:", error);
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

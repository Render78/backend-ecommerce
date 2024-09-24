import UserRepository from './user.repository.js';
import UserModel from '../dao/models/user.model.js';
import { sendAccountDeletionEmail } from '../utils/mailer.js';

export default class UserRepositoryImpl extends UserRepository {

    async findById(uid) {
        try {
            const user = await UserModel.findById(uid);
            return user;
        } catch (error) {
            console.log('Error al buscar el usuario por ID' + error);
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email: email.trim() });
            console.log(`Buscando usuario con el correo: ${email}. Encontrado: ${user}`);
            return user;
        } catch (error) {
            console.error('Error en findUserByEmail:', error);
            throw error;
        }
    }

    async getUsers() {
        try {
            const users = await UserModel.find();
            return users;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw error;
        }
    }

    async createUser(user) {
        try {
            const newUser = new UserModel(user);
            await newUser.save();
            console.log(`Usuario creado: ${newUser}`);
            return newUser;
        } catch (error) {
            console.error('Error en createUser:', error);
            throw error;
        }
    }

    async updateUser(user) {
        try {
            await UserModel.findByIdAndUpdate(user._id, user);
            console.log(`Usuario actualizado: ${user}`);
        } catch (error) {
            console.error('Error en updateUser:', error);
            throw error;
        }
    }

    async deleteInactiveUsers() {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        try {
            const inactiveUsers = await UserModel.find({ last_connection: { $lt: twoDaysAgo } });

            const result = await UserModel.deleteMany({ last_connection: { $lt: twoDaysAgo } });

            console.log(`${result.deletedCount} usuarios eliminados por inactividad.`);

            for (const user of inactiveUsers) {
                await sendAccountDeletionEmail(user.email);
            }

            return result;
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error);
            throw error;
        }
    }

    async delete(userId) {
        return await UserModel.findByIdAndDelete(userId);
    }

    async toggleUserRole(userId) {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            user.role = user.role === 'user' ? 'premium' : 'user';

            await user.save();
            console.log(`Rol cambiado a ${user.role} para el usuario con ID: ${userId}`);
            return user;
        } catch (error) {
            console.error('Error en toggleUserRole:', error);
            throw error;
        }
    }
}

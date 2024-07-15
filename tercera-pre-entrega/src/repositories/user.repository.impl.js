import UserRepository from './user.repository.js';
import UserModel from '../dao/models/user.model.js';

export default class UserRepositoryImpl extends UserRepository {
    async findUserByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async createUser(user) {
        const newUser = new UserModel(user);
        return await newUser.save();
    }

    async updateUser(user) {
        return await user.save();
    }
}

import { UserRepositoryPort } from '../../application/ports/user-repository.port.js';
import { UserMapper } from '../../domain/user.mapper.js';

class UserRepository extends UserRepositoryPort {
    constructor(userModel) {
        super();
        this.userModel = userModel;
    }

    createUser = async userData => {
        const persistenceData = UserMapper.toPersistence(userData);
        const newUser = new this.userModel(persistenceData);
        const savedUser = await newUser.save();

        return UserMapper.toDomain(savedUser);
    };

    findByEmail = async email => {
        const user = await this.userModel
            .findOne({ email })
            .select('-password');

        return UserMapper.toDomain(user);
    };

    findByEmailWithPassword = async email => {
        const user = await this.userModel.findOne({ email });

        return UserMapper.toDomain(user);
    };

    findById = async id => {
        const user = await this.userModel
            .findOne({ _id: id })
            .select('-password');

        return UserMapper.toDomain(user);
    };

    findByUsername = async username => {
        const user = await this.userModel
            .findOne({ username })
            .select('-password');

        return UserMapper.toDomain(user);
    };
}

export default UserRepository;

import { UserRepositoryPort } from '../../../modules/user/ports/user-repository.port.js';
import { UserMapper } from '../../../modules/user/user.mapper.js';

class MongoUserRepository extends UserRepositoryPort {
    constructor(userModel) {
        super();
        this.userModel = userModel;
    }

    createUser = async userData => {
        const newUser = new this.userModel(userData);
        const savedUser = await newUser.save();

        return UserMapper.toDomain(savedUser);
    };

    findByEmail = async email => {
        const user = await this.userModel
            .findOne({ email })
            .select('-password');

        return UserMapper.toDomain(user);
    };

    findAuthByEmail = async email => {
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

export default MongoUserRepository;

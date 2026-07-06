import { UserReaderPort } from '../../application/ports/user-reader.port.js';
import { UserWriterPort } from '../../application/ports/user-writer.port.js';
import { UserMapper } from '../mappers/user.mapper.js';
import { DuplicateFieldError } from '../../../../shared/index.js';

export class UserReaderRepository extends UserReaderPort {
    constructor(userModel) {
        super();
        this.userModel = userModel;
    }

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

export class UserWriterRepository extends UserWriterPort {
    constructor(userModel) {
        super();
        this.userModel = userModel;
    }

    createUser = async userData => {
        try {
            const persistenceData = UserMapper.toPersistence(userData);
            const newUser = new this.userModel(persistenceData);
            const savedUser = await newUser.save();

            return UserMapper.toDomain(savedUser);
        } catch (error) {
            if (error.code === 11000 && error.keyValue) {
                const field = Object.keys(error.keyValue)[0];
                throw new DuplicateFieldError(field);
            }
            throw error;
        }
    };
}

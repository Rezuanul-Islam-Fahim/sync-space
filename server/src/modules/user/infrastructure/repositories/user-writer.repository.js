import { UserWriterPort } from '../../application/ports/user-writer.port.js';
import { UserMapper } from '../mappers/user.mapper.js';

export class UserWriterRepository extends UserWriterPort {
    constructor(userModel) {
        super();
        this.userModel = userModel;
    }

    createUser = async userEntity => {
        const persistenceData = UserMapper.toPersistence(userEntity);
        const newUser = new this.userModel(persistenceData);
        const savedUser = await newUser.save();

        return UserMapper.toDomain(savedUser);
    };
}

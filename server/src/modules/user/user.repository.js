class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }

    createUser = async userData => {
        const newUser = new this.userModel(userData);
        return await newUser.save();
    };

    findByEmail = async email => {
        return await this.userModel.findOne({ email });
    };

    findById = async id => {
        return await this.userModel.findOne({ _id: id });
    };

    findByUsername = async username => {
        return await this.userModel.findOne({ username });
    };
}

export default UserRepository;

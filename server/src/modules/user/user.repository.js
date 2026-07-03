class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async createUser(userData) {
        const newUser = new this.userModel(userData);
        return await newUser.save();
    }

    async findByEmail(email) {
        return await this.userModel.findOne({ email });
    }

    async findById(id) {
        return await this.userModel.findOne({ _id: id });
    }

    async findByUsername(username) {
        return await this.userModel.findOne({ username });
    }
}

export default UserRepository;

const toRawObject = value => {
    if (!value) return null;

    return typeof value.toObject === 'function'
        ? value.toObject({ transform: false })
        : value;
};

const toUserEntity = value => {
    const user = toRawObject(value);
    if (!user) return null;

    return {
        id: (user._id ?? user.id)?.toString(),
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        banner: user.banner,
        bannerColor: user.bannerColor,
        dateOfBirth: user.dateOfBirth,
        isVerified: user.isVerified,
        status: user.status,
        lastOnline: user.lastOnline,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const toAuthUserEntity = value => {
    const user = toRawObject(value);
    if (!user) return null;

    return {
        ...toUserEntity(user),
        password: user.password,
    };
};

class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }

    createUser = async userData => {
        const newUser = new this.userModel(userData);
        const savedUser = await newUser.save();

        return toUserEntity(savedUser);
    };

    findByEmail = async email => {
        const user = await this.userModel.findOne({ email });

        return toUserEntity(user);
    };

    findAuthByEmail = async email => {
        const user = await this.userModel.findOne({ email });

        return toAuthUserEntity(user);
    };

    findById = async id => {
        const user = await this.userModel.findOne({ _id: id });

        return toUserEntity(user);
    };

    findByUsername = async username => {
        const user = await this.userModel.findOne({ username });

        return toUserEntity(user);
    };
}

export default UserRepository;

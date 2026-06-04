import { User } from './user.model.js';

export const createUser = async userData => {
    const newUser = new User(userData);
    return await newUser.save();
};

export const findByEmail = email => {
    return User.findOne({ email });
};

export const findByUsername = username => {
    return User.findOne({ username });
};

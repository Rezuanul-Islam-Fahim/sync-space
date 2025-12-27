import { User } from '../models/user.js'

export const createUser = async (userData) => {
    const newUser = new User(userData)
    return await newUser.save()
}

export const findByEmail = (email) => {
    return User.findOne({ email })
}
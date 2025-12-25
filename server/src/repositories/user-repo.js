import { User } from '../models/user.js'

export const createUser = async (userData) => {
    const newUser = new User(userData)
    const savedData = await newUser.save()

    return savedData.toObject()
}

export const findByEmail = (email) => {
    return User.findOne({ email }).lean()
}
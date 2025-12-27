import bcrypt from 'bcrypt'
import * as userRepo from '../repositories/user-repo.js'
import AppError from '../utils/app-error.js'

export const registerUser = async (data) => {
    const { email, username, password, dateOfBirth } = data

    const existingUser = await userRepo.findByEmail(email)

    if (existingUser) {
        throw new AppError('User with this email is already registered', 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await userRepo.createUser({
        email,
        username,
        password: hashedPassword,
        dateOfBirth
    })

    return newUser
}

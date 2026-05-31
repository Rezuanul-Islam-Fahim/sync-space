import bcrypt from 'bcrypt'
import * as userRepo from './auth.repository.js'
import AppError from '../../utils/app.error.js'
import config from '../../common/config.js'

export const registerUser = async (data) => {
    const existingUserByEmail = await userRepo.findByEmail(data.email)
    const existingUserByUsername = await userRepo.findByUsername(data.username)

    if (existingUserByEmail) {
        throw new AppError('User with this email is already registered', 409)
    }

    if (existingUserByUsername) {
        throw new AppError('Username is already taken', 409)
    }

    const hashedPassword = await bcrypt.hash(data.password, config.auth.saltRounds)

    const newUser = await userRepo.createUser({ ...data, password: hashedPassword })

    return newUser
}

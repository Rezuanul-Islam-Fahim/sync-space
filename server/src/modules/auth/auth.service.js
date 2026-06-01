import bcrypt from 'bcrypt'
import { userRepo } from '../user/index.js'
import AppError from '../../common/app-error.js'
import { CONFLICT } from '../../constants/http-status.js'
import config from '../../config/index.js'

export const registerUser = async data => {
    const existingUserByEmail = await userRepo.findByEmail(data.email)
    const existingUserByUsername = await userRepo.findByUsername(data.username)

    if (existingUserByEmail) {
        throw new AppError(
            'User with this email is already registered',
            CONFLICT
        )
    }

    if (existingUserByUsername) {
        throw new AppError('Username is already taken', CONFLICT)
    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        config.auth.saltRounds
    )

    const newUser = await userRepo.createUser({
        ...data,
        password: hashedPassword
    })

    return newUser
}

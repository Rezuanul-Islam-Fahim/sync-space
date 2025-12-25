import bcrypt from 'bcrypt'
import * as userRepo from '../repositories/user-repo.js'

export const registerUser = async (data) => {
    const { email, password } = data

    const existingUser = await userRepo.findByEmail(email)

    if (existingUser) {
        const error = new Error('User with this email is already registered')
        error.statusCode = 409

        throw error
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await userRepo.createUser({
        email,
        password: hashedPassword
    })
    const { password: _, ...userWithoutPassword } = newUser

    return userWithoutPassword
}
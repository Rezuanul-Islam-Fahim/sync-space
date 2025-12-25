import { isDev } from '../../config/index.js'
import * as authServices from '../../services/auth-services.js'

export const register = async (req, res) => {
    try {
        const { email, password } = req.body

        const userData = await authServices.registerUser(
            { email, password }
        )

        res.status(201).json({
            success: true,
            data: userData,
            message: 'New user created successfully'
        })
    }
    catch (err) {
        console.log('Error occurred: ', err)

        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: isDev() ? err.message : undefined
        })
    }
}

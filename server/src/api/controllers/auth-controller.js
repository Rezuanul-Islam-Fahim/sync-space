import * as authServices from '../../services/auth-services.js'

export const register = async (req, res, next) => {
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
        next(err)
    }
}

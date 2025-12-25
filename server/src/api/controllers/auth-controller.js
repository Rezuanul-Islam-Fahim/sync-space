import * as authService from '../../services/auth-service.js'

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const userData = await authService.registerUser(
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

import * as authService from '../../services/auth-service.js'

export const register = async (req, res, next) => {
    try {
        const userData = await authService.registerUser(req.body)

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

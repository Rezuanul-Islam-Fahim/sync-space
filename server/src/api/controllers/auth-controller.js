import * as authService from '../../services/auth-service.js'
import { RegisterRequestDto, RegisterResponseDto } from '../dtos/auth.dto.js'

export const register = async (req, res, next) => {
    try {
        const requestDto = RegisterRequestDto.from(req.body)
        const userData = await authService.registerUser(requestDto)
        const responseDto = RegisterResponseDto.from(userData)
        console.log(responseDto)

        res.status(201).json({
            success: true,
            data: responseDto,
            message: 'New user created successfully'
        })
    }
    catch (err) {
        next(err)
    }
}

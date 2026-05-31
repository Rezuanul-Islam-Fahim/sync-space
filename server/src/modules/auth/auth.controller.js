import * as authService from './auth.service.js'
import { RegisterRequestDto, RegisterResponseDto } from './auth.dto.js'
import ApiResponse from '../../common/api-response.js'

export const register = async (req, res, next) => {
    try {
        const requestDto = RegisterRequestDto.from(req.body)
        const userData = await authService.registerUser(requestDto)
        const responseDto = RegisterResponseDto.from(userData)

        ApiResponse.success({
            res,
            data: responseDto,
            statusCode: 201,
            message: 'New user created successfully'
        })
    } catch (err) {
        next(err)
    }
}

import * as authService from './auth.service.js'
import { RegisterRequestDto, RegisterResponseDto } from './auth.dto.js'
import ApiResponse from '../../common/api-response.js'
import { CREATED } from '../../constants/http-status.js'
import { USER_CREATED } from '../../constants/app-messages.js'

export const register = async (req, res, next) => {
    try {
        const requestDto = RegisterRequestDto.from(req.body)
        const userData = await authService.registerUser(requestDto)
        const responseDto = RegisterResponseDto.from(userData)

        ApiResponse.success({
            res,
            data: responseDto,
            statusCode: CREATED,
            message: USER_CREATED
        })
    } catch (err) {
        next(err)
    }
}

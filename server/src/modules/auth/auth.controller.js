import * as authService from './auth.service.js';
import { RegisterRequestDto, RegisterResponseDto } from './auth.dto.js';
import ApiResponse from '../../common/api-response.js';
import { CREATED } from '../../constants/http-status.js';
import { USER_CREATED } from '../../constants/app-messages.js';
import catchAsync from '../../common/catch-async.js';

export const register = catchAsync(async (req, res) => {
    const requestDto = RegisterRequestDto.from(req.body);
    const userData = await authService.registerUser(requestDto);
    const responseDto = RegisterResponseDto.from(userData);

    ApiResponse.success({
        res,
        data: responseDto,
        statusCode: CREATED,
        message: USER_CREATED,
    });
});

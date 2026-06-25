import * as authService from './auth.service.js';
import { RegisterRequestDto, RegisterResponseDto } from './auth.dto.js';
import ApiResponse from '../../common/api-response.js';
import { CREATED, OK } from '../../constants/http-status.js';
import {
    USER_CREATED,
    LOGIN_SUCCESSFUL,
} from '../../constants/app-messages.js';
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

export const login = catchAsync(async (req, res) => {
    const userData = await authService.loginUser(req.body);

    ApiResponse.success({
        res,
        data: userData,
        statusCode: OK,
        message: LOGIN_SUCCESSFUL,
    });
});

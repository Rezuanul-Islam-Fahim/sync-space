import {
    LoginRequestDto,
    LoginResponseDto,
    RegisterRequestDto,
    RegisterResponseDto,
} from './auth.dto.js';
import ApiResponse from '../../common/api-response.js';
import { CREATED, OK } from '../../constants/http-status.js';
import {
    USER_CREATED,
    LOGIN_SUCCESSFUL,
} from '../../constants/app-messages.js';
import catchAsync from '../../common/catch-async.js';
import { loginUserUseCase, registerUserUseCase } from './usecases/index.js';

export const register = catchAsync(async (req, res) => {
    const requestDto = RegisterRequestDto.from(req.body);
    const userData = await registerUserUseCase.execute(requestDto);
    const responseDto = RegisterResponseDto.from(userData);

    ApiResponse.success({
        res,
        data: responseDto,
        statusCode: CREATED,
        message: USER_CREATED,
    });
});

export const login = catchAsync(async (req, res) => {
    const requestDto = LoginRequestDto.from(req.body);
    const loginData = await loginUserUseCase.execute(requestDto);
    const responseDto = LoginResponseDto.from(loginData);

    ApiResponse.success({
        res,
        data: responseDto,
        statusCode: OK,
        message: LOGIN_SUCCESSFUL,
    });
});

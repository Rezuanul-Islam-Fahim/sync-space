import {
    LoginRequestDto,
    LoginResponseDto,
    RegisterRequestDto,
    RegisterResponseDto,
} from './auth.dto.js';
import ApiResponse from '../../../shared/responses/api.response.js';
import { CREATED, OK } from '../../../constants/http-status.constant.js';
import {
    USER_CREATED,
    LOGIN_SUCCESSFUL,
} from '../../../constants/app-messages.constant.js';
import catchAsync from '../../../shared/catch-async.util.js';

class AuthController {
    constructor({ loginUserUseCase, registerUserUseCase }) {
        this.loginUserUseCase = loginUserUseCase;
        this.registerUserUseCase = registerUserUseCase;
    }

    register = catchAsync(async (req, res) => {
        const requestDto = RegisterRequestDto.from(req.body);
        const userData = await this.registerUserUseCase.execute(requestDto);
        const responseDto = RegisterResponseDto.from(userData);

        ApiResponse.success({
            res,
            data: responseDto,
            statusCode: CREATED,
            message: USER_CREATED,
        });
    });

    login = catchAsync(async (req, res) => {
        const requestDto = LoginRequestDto.from(req.body);
        const loginData = await this.loginUserUseCase.execute(requestDto);
        const responseDto = LoginResponseDto.from(loginData);

        ApiResponse.success({
            res,
            data: responseDto,
            statusCode: OK,
            message: LOGIN_SUCCESSFUL,
        });
    });
}

export default AuthController;

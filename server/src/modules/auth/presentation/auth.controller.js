import {
    LoginRequestDto,
    LoginResponseDto,
    RegisterRequestDto,
    RegisterResponseDto,
} from './dto/index.js';
import { ApiResponse, catchAsync } from '../../../shared/index.js';
import {
    CREATED,
    OK,
    USER_CREATED,
    LOGIN_SUCCESSFUL,
} from '../../../shared/constant/index.js';

export class AuthController {
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

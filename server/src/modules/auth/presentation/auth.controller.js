import {
    LoginRequestDto,
    LoginResponseDto,
    RegisterRequestDto,
    AuthUserResponseDto,
} from './dto/index.js';
import { ApiResponse, catchAsync } from '../../../shared/index.js';
import {
    CREATED,
    OK,
} from '../../../shared/constant/index.js';
import {
    USER_CREATED,
    LOGIN_SUCCESSFUL,
} from './auth.messages.js';

export class AuthController {
    constructor({ loginUserUseCase, registerUserUseCase, logger }) {
        this.loginUserUseCase = loginUserUseCase;
        this.registerUserUseCase = registerUserUseCase;
        this.logger = logger;
    }

    register = catchAsync(async (req, res) => {
        const requestDto = RegisterRequestDto.from(req.body);
        const userData = await this.registerUserUseCase.execute(requestDto);
        const responseDto = AuthUserResponseDto.from(userData);

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

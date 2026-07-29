import { LoginRequestDto } from './dtos/login-request.dto.js';
import { LoginResponseDto } from './dtos/login-response.dto.js';
import { ApiResponse, catchAsync } from '../../../shared/util/index.js';
import { OK } from '../../../shared/constant/index.js';
import { LOGIN_SUCCESSFUL } from './auth.messages.js';

export class AuthController {
    constructor({ loginUserUseCase, logger }) {
        this.loginUserUseCase = loginUserUseCase;
        this.logger = logger;
    }

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

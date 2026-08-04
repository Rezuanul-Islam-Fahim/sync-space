import { matchedData } from 'express-validator';
import { LoginRequestDto } from './dtos/login-request.dto.js';
import { LoginResponseDto } from './dtos/login-response.dto.js';
import { ApiResponse, catchAsync } from '../../../shared/util/index.js';
import { OK } from '../../../shared/constants/index.js';
import { LOGIN_SUCCESSFUL } from './auth.messages.js';

export class AuthController {
    constructor({ authService, logger }) {
        this.authService = authService;
        this.logger = logger;
    }

    login = catchAsync(async (req, res) => {
        const validatedData = matchedData(req);
        const requestDto = LoginRequestDto.from(validatedData);

        this.logger?.debug?.('Login request received', {
            email: requestDto.email,
        });

        const loginData = await this.authService.loginUser(requestDto);

        const responseDto = LoginResponseDto.from(loginData);

        ApiResponse.success({
            res,
            data: responseDto,
            statusCode: OK,
            message: LOGIN_SUCCESSFUL,
        });
    });
}

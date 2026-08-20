import { matchedData } from 'express-validator';
import { LoginRequestDto } from './dtos/login-request.dto.js';
import { LoginResponseDto } from './dtos/login-response.dto.js';
import {
    sendSuccessResponse,
    catchAsync,
    maskEmail,
} from '../../../shared/util/index.js';
import { OK } from '../../../shared/constants/index.js';
import { LOGIN_SUCCESSFUL } from './auth.messages.js';

/**
 * Controller handling authentication endpoints.
 */
export class AuthController {
    /**
     * @param {{
     *   loginUserUseCase: import('../application/use-cases/login-user.usecase.js').LoginUserUseCase,
     *   logger?: import('../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ loginUserUseCase, logger }) {
        this.loginUserUseCase = loginUserUseCase;
        this.logger = logger;
    }

    login = catchAsync(async (req, res) => {
        const validatedData = matchedData(req);
        const requestDto = LoginRequestDto.from(validatedData);

        this.logger?.debug?.('Login request received', {
            email: maskEmail(requestDto.email),
        });

        const loginData = await this.loginUserUseCase.execute(requestDto);

        const responseDto = LoginResponseDto.from(loginData);

        sendSuccessResponse({
            res,
            data: responseDto,
            statusCode: OK,
            message: LOGIN_SUCCESSFUL,
        });
    });
}

import { matchedData } from 'express-validator';
import { LoginRequestDto } from './dtos/login-request.dto.js';
import { LoginResponseDto } from './dtos/login-response.dto.js';
import { TokenRefreshResponseDto } from './dtos/token-refresh-response.dto.js';
import { TokenRefreshRequestDto } from './dtos/token-refresh-request.dto.js';
import {
    sendSuccessResponse,
    catchAsync,
    maskEmail,
} from '../../../shared/util/index.js';
import { OK } from '../../../shared/constants/index.js';
import { LOGIN_SUCCESSFUL, NEW_SESSION_GENERATED } from './auth.messages.js';

/**
 * Controller handling authentication endpoints.
 */
export class AuthController {
    /**
     * @param {{
     *   loginUserUseCase: import('../application/use-cases/login-user.usecase.js').LoginUserUseCase,
     *   tokenRefreshUseCase: import('../application/use-cases/token-refresh.usecase.js').TokenRefreshUseCase
     *   logger?: import('../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ loginUserUseCase, tokenRefreshUseCase, logger }) {
        this.loginUserUseCase = loginUserUseCase;
        this.tokenRefreshUseCase = tokenRefreshUseCase;
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

    tokenRefresh = catchAsync(async (req, res) => {
        const validatedData = matchedData(req);
        const tokenRefreshRequestDto =
            TokenRefreshRequestDto.from(validatedData);

        const { newToken: token, newRefreshToken: refreshToken } =
            await this.tokenRefreshUseCase.execute(tokenRefreshRequestDto);

        const tokenRefreshResponseDto = TokenRefreshResponseDto.from({
            token,
            refreshToken,
        });

        sendSuccessResponse({
            res,
            data: tokenRefreshResponseDto,
            statusCode: OK,
            message: NEW_SESSION_GENERATED,
        });
    });
}

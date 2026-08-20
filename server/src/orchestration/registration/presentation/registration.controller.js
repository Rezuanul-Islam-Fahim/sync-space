import { matchedData } from 'express-validator';
import {
    catchAsync,
    sendSuccessResponse,
    maskEmail,
} from '../../../shared/util/index.js';
import { CREATED } from '../../../shared/constants/index.js';
import { RegistrationRequestDto } from './dtos/registration-request.dto.js';
import { RegistrationResponseDto } from './dtos/registration-response.dto.js';
import { USER_CREATED } from './registration.messages.js';

/**
 * Controller handling user registration requests and orchestrating registration sagas.
 */
export class RegistrationController {
    /**
     * @param {{
     *   registerUserProfileUseCase: import('../application/use-cases/register-user-profile.usecase.js').RegisterUserProfileUseCase,
     *   logger?: import('../../../shared/ports/index.js').LoggerPort
     * }} deps
     */
    constructor({ registerUserProfileUseCase, logger }) {
        this.registerUserProfileUseCase = registerUserProfileUseCase;
        this.logger = logger;
    }

    register = catchAsync(async (req, res) => {
        const validatedData = matchedData(req);
        const requestDto = RegistrationRequestDto.from(validatedData);

        this.logger?.debug?.('Registration request received', {
            email: maskEmail(requestDto.email),
        });

        const registrationResult =
            await this.registerUserProfileUseCase.execute(requestDto);

        const responseDto = RegistrationResponseDto.from(registrationResult);

        sendSuccessResponse({
            res,
            data: responseDto,
            statusCode: CREATED,
            message: USER_CREATED,
        });
    });
}

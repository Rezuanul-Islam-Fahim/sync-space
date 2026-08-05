import { matchedData } from 'express-validator';
import { catchAsync, sendSuccessResponse } from '../../../shared/util/index.js';
import { CREATED } from '../../../shared/constants/index.js';
import { RegistrationRequestDto } from './dtos/registration-request.dto.js';
import { RegistrationResponseDto } from './dtos/registration-response.dto.js';
import { USER_CREATED } from './registration.messages.js';

export class RegistrationController {
    constructor({ registrationService, logger }) {
        this.registrationService = registrationService;
        this.logger = logger;
    }

    register = catchAsync(async (req, res) => {
        const validatedData = matchedData(req);
        const requestDto = RegistrationRequestDto.from(validatedData);

        this.logger?.debug?.('Registration request received', {
            email: requestDto.email,
        });

        const registrationResult =
            await this.registrationService.registerUser(requestDto);

        const responseDto = RegistrationResponseDto.from(registrationResult);

        sendSuccessResponse({
            res,
            data: responseDto,
            statusCode: CREATED,
            message: USER_CREATED,
        });
    });
}

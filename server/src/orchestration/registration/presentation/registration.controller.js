import { matchedData } from 'express-validator';
import { catchAsync, ApiResponse } from '../../../shared/util/index.js';
import { CREATED } from '../../../shared/constants/index.js';
import { RegistrationRequestDto } from './dtos/registration-request.dto.js';
import { RegistrationResponseDto } from './dtos/registration-response.dto.js';
import { USER_CREATED } from './registration.messages.js';

export class RegistrationController {
    constructor({ registerUserProfileUseCase, logger }) {
        this.registerUserProfileUseCase = registerUserProfileUseCase;
        this.logger = logger;
    }

    register = catchAsync(async (req, res) => {
        const validatedData = matchedData(req);
        const requestDto = RegistrationRequestDto.from(validatedData);
        const savedAuthUser =
            await this.registerUserProfileUseCase.execute(requestDto);

        const responseDto = RegistrationResponseDto.from(savedAuthUser);

        ApiResponse.success({
            res,
            data: responseDto,
            statusCode: CREATED,
            message: USER_CREATED,
        });
    });
}

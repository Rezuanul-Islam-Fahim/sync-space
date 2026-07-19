import { catchAsync, ApiResponse } from '../../../shared/util/index.js';
import { CREATED } from '../../../shared/constant/index.js';
import { RegistrationResponseDto } from '../dto/registration-response.dto.js';
import { USER_CREATED } from '../../../modules/auth/index.js';

export class RegistrationController {
    constructor({ registerUserProfileUseCase, logger }) {
        this.registerUserProfileUseCase = registerUserProfileUseCase;
        this.logger = logger;
    }

    register = catchAsync(async (req, res) => {
        const savedAuthUser = await this.registerUserProfileUseCase.execute(
            req.body
        );

        const responseDto = RegistrationResponseDto.from(savedAuthUser);

        ApiResponse.success({
            res,
            data: responseDto,
            statusCode: CREATED,
            message: USER_CREATED,
        });
    });
}

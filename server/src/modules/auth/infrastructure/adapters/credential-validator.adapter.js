import { ValidateCredentialsPort } from '../../application/ports/validate-credentials.port.js';
import { AuthUser } from '../../domain/auth-user.entity.js';

export class CredentialValidatorAdapter extends ValidateCredentialsPort {
    constructor({ validateCredentialsUseCase }) {
        super();
        this.validateCredentialsUseCase = validateCredentialsUseCase;
    }

    async execute(data) {
        const user = await this.validateCredentialsUseCase.execute(data);
        return user ? new AuthUser(user) : null;
    }
}


import { ValidateCredentialsPort } from '../../application/ports/validate-credentials.port.js';

export class CredentialValidatorAdapter extends ValidateCredentialsPort {
    constructor({ validateCredentialsUseCase }) {
        super();
        this.validateCredentialsUseCase = validateCredentialsUseCase;
    }

    async execute(data) {
        return this.validateCredentialsUseCase.execute(data);
    }
}

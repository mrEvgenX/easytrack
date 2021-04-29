export class RegistrationFormValidationError extends Error {
    constructor(...params) {
        super(...params)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RegistrationFormValidationError)
        }
    }
}

export class UserAlreadyExists extends Error {
    constructor(...params) {
        super(...params)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserAlreadyExists)
        }
    }
}

export class EmailNotVerified extends Error {
    constructor(...params) {
        super(...params)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EmailNotVerified)
        }
    }
}

export class AccessTokenExpiredError extends Error {
    constructor() {
        super('Access token expired');
        this.name = 'AccessTokenExpiredError';
    }
}
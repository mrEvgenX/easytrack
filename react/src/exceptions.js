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

import { RegistrationFormValidationError, UserAlreadyExists, EmailNotVerified } from './exceptions';

const baseAPIUrl = '/api/v1/';


export async function createNewUser(login, password, csrftoken) {
    const response = await fetch(
        baseAPIUrl + 'auth/register',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                email: login,
                password
            })
        }
    )
    const data = await response.json();
    if (!response.ok) {
        if (response.status === 400) {
            if ('detail' in data) {
                if (data.detail.includes('already exists')) {
                    throw new UserAlreadyExists(data.detail);
                } else if (data.detail.includes('address is not verified')) {
                    throw new EmailNotVerified(data.detail);
                }
            }
            throw new RegistrationFormValidationError('Form not valid');
        } else {
            throw new Error(response.status + ': ' + JSON.stringify(data));
        }
    }
    return data;
}


export async function getConfirmationStatus(userId, token) {
    const response = await fetch(
        `${baseAPIUrl}auth/confirm/${userId}/${token}`, {
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    }
    );
    if (!response.ok) {
        const error = await response.json()
        throw new Error(response.status + ': ' + JSON.stringify(error));
    }
    const data = await response.json();
    return data;
}

import { RegistrationFormValidationError, UserAlreadyExists, EmailNotVerified, AccessTokenExpiredError } from './exceptions';

const baseAPIUrl = '/api/v1/';


export async function createNewUser(login, password) {
    const response = await fetch(
        baseAPIUrl + 'auth/register',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                email: login,
                password
            })
        }
    )
    const data = await response.json();
    if (!response.ok && response.status === 400) {
        if ('detail' in data) {
            if (data.detail.includes('already exists')) {
                throw new UserAlreadyExists(data.detail);
            } else if (data.detail.includes('address is not verified')) {
                throw new EmailNotVerified(data.detail);
            }
        }
        throw new RegistrationFormValidationError('Form not valid');
    }
    return data;
}


export async function addTrackEntry(accessToken, timeBucket, itemId) {
    const response = await fetch(
        baseAPIUrl + 'entries',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                timeBucket,
                item: itemId
            })
        }
    )
    if (response.status === 401) {
        throw new AccessTokenExpiredError();
    }
    if (!response.ok) {
        const error = await response.json();
        throw new Error(response.status + ': ' + JSON.stringify(error));
    }
    return await response.json();
}


export async function bulkUpdateTrackEntries(accessToken, add, remove) {
    const response = await fetch(
        baseAPIUrl + 'entries/bulk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            add, remove
        })
    }
    );
    if (response.status === 401) {
        throw new AccessTokenExpiredError();
    }
    if (!response.ok) {
        const error = await response.json()
        throw new Error(response.status + ': ' + JSON.stringify(error));
    }
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

import { RegistrationFormValidationError, UserAlreadyExists, EmailNotVerified } from './exceptions';

const baseAPIUrl = '/api/v1/';


export class AccessTokenExpiredError extends Error {
    constructor() {
        super('Access token expired');
        this.name = 'AccessTokenExpiredError';
    }
}


export function populateState(accessToken) {
    return new Promise((resolve, reject) => {
        if (accessToken === null) {
            reject(new Error('Access token not provided'));
        }
        Promise.all([
            baseAPIUrl + 'items',
            baseAPIUrl + 'entries'
        ].map(url => fetch(
            url, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            }
        }
        )))
            .then(responses => {
                if (responses.some(response => response.status === 401)) {
                    reject(new AccessTokenExpiredError());
                } else if (responses.some(response => !response.ok)) {
                    reject(new Error('Something went wrong'));
                }
                return responses;
            })
            .then(responses => {
                Promise.all(responses.map(response => response.json()))
                    .then(data => {
                        resolve({
                            trackedItems: data[0],
                            trackEntries: data[1]
                        });
                    });
            })
    });
}


export function refreshAccess(refreshToken) {
    return new Promise((resolve, reject) => {
        fetch(
            baseAPIUrl + 'auth/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        }
        )
            .then(response => {
                if (!response.ok)
                    throw new Error(response.status);
                return response;
            })
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}


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


export async function createElement(accessToken, name) {
    let request_body = {
        name
    }
    const response = await fetch(
        baseAPIUrl + 'items',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(request_body)
        }
    )
    if (response.status === 401) {
        throw new AccessTokenExpiredError();
    }
    if (!response.ok) {
        const error = await response.json();
        throw new Error(response.status + ': ' + JSON.stringify(error));
    }
    const data = await response.json()
    return data;
}


export async function deleteElement(accessToken, itemId) {
    const response = await fetch(
        baseAPIUrl + 'items/' + itemId,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            },
        }
    );
    if (response.status === 401) {
        throw new AccessTokenExpiredError();
    }
    if (!response.ok) {
        const error = await response.json();
        throw new Error(response.status + ': ' + JSON.stringify(error));
    }
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

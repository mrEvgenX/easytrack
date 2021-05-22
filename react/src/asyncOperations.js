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


export async function obtainTelegramConnectionData(access) {
    const telegramConnectionStatusResponse = await fetch(
        baseAPIUrl + 'telegram/connection/status', {
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${access}`
        }
    })
    let {
        connected: connectedStatus,
        telegram_username: username,
        telegram_connection_link: connectionLink
    } = await telegramConnectionStatusResponse.json()
    if (!connectedStatus && connectionLink == null) {
        console.log('Need to request telegram connection link')
        const telegramGenerateLinkResponse = await fetch(
            baseAPIUrl + 'telegram/connection/generate_link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${access}`
            }
        })
        let telegramGenerateLinkData = await telegramGenerateLinkResponse.json()
        connectionLink = telegramGenerateLinkData.result
    }
    return {
        connectedStatus,
        username,
        connectionLink,
    }
}


export function sendTestTelegramMessage(access) {
    return fetch(
        baseAPIUrl + 'telegram/test_message/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${access}`
        }
    })
}


export function detachTelegramAccount(access) {
    return fetch(
        baseAPIUrl + 'telegram/connection/detach', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${access}`
        }
    })
}


export async function getNotificationTime(access, itemId) {
    const response = await fetch(
        `${baseAPIUrl}telegram/notifications/${itemId}`, {
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${access}`
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


export async function deleteNotificationTime(access, itemId) {
    const response = await fetch(
        `${baseAPIUrl}telegram/notifications/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${access}`
        }
    }
    );
    if (!response.ok) {
        const error = await response.json()
        throw new Error(response.status + ': ' + JSON.stringify(error));
    }
}


export async function setNotificationTime(access, itemId, notificationTime) {
    const response = await fetch(
        `${baseAPIUrl}telegram/notifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify({ item_id: itemId, notification_time: notificationTime })
    }
    );
    if (!response.ok) {
        const error = await response.json()
        throw new Error(response.status + ': ' + JSON.stringify(error));
    }
}

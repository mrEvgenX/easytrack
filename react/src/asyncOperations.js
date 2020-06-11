const baseAPIUrl = 'http://localhost:8000/api/v1/';


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
            baseAPIUrl + 'folders',
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
                            folders: data[0],
                            trackedItems: data[1],
                            trackEntries: data[2]
                        });
                    });
            })
    });
}


export function requestAndStoreCredentials(username, password) {
    return new Promise((resolve, reject) => {
        fetch(
            baseAPIUrl + 'auth/token/obtain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                username,
                password
            })
        })
            .then(response => {
                if (!response.ok)
                    throw new Error(response.status);
                return response;
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('refreshToken', data.refresh);
                localStorage.setItem('accessToken', data.access);
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
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
                localStorage.setItem('accessToken', data.access);
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}


export function clearCredentialsFromStore() {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
}


export function createNewUser(login, password) {
    return new Promise((resolve, reject) => {
        fetch(
            baseAPIUrl + 'auth/register', {
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


export async function createFolder(accessToken, name) {
    const response = await fetch(
        baseAPIUrl + 'folders',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name
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


export async function deleteFolder(accessToken, folderSlug) {
    const response = await fetch(
        baseAPIUrl + 'folders/' + folderSlug,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            },
        }
    )
    if (response.status === 401) {
        throw new AccessTokenExpiredError();
    }
    if (!response.ok) {
        const error = await response.json();
        throw new Error(response.status + ': ' + JSON.stringify(error));
    }
}

export async function createElement(accessToken, folder, name) {
    let request_body = null
    if (folder === null) {
        request_body = {
            name
        }
    } else {
        request_body = {
            folder,
            name
        }
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


export async function putElementInFolder(accessToken, itemId, folder) {
    if (folder === '') {
        folder = null;
    }
    const response = await fetch(
        baseAPIUrl + 'items/' + itemId, 
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({folder})
        }
    );
    if (response.status === 401) {
        throw new AccessTokenExpiredError();
    }
    if (!response.ok) {
        const error = await response.json();
        throw new Error(response.status + ': ' + JSON.stringify(error));
    }
    return await response.json();
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

const baseAPIUrl = 'http://localhost:8000/api/v1/';


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
                if (responses.some(response => !response.ok)) {
                    reject(new Error('Access token expired'));
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


export function createFolder(accessToken, name) {
    return new Promise((resolve, reject) => {
        fetch(
            baseAPIUrl + 'folders', {
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
            .then(response => response.json())
            .then(data => {
                resolve(data);
            });
    });
}

export function deleteFolder(accessToken, folderSlug) {
    return new Promise((resolve, reject) => {
        fetch(
            baseAPIUrl + 'folders/' + folderSlug, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            },
        }
        )
            .then(_ => {
                resolve();
            });
    });
}

export function createElement(accessToken, folder, name) {
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
    return new Promise((resolve, reject) => {
        fetch(
            baseAPIUrl + 'items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(request_body)
        }
        )
            .then(response => response.json())
            .then(data => {
                resolve(data);
            });
    });
}


export function putElementInFolder(accessToken, itemId, folder) {
    if (folder === '') {
        folder = null;
    }
    return new Promise((resolve, reject) => {
        fetch(
            baseAPIUrl + 'items/' + itemId, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({folder})
        }
        )
            .then(response => response.json())
            .then(data => {
                resolve(data);
            });
    });
}


export function deleteElement(accessToken, itemId) {
    return new Promise((resolve, reject) => {
        fetch(
            baseAPIUrl + 'items/' + itemId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${accessToken}`
            },
        }
        )
            .then(_ => {
                resolve();
            });
    });
}


export function addTrackEntry(accessToken, timeBucket, itemId) {
    return new Promise((resolve, reject) => {
        fetch(
            baseAPIUrl + 'entries', {
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

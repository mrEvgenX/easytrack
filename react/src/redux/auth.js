const baseAPIUrl = '/api/v1/';


// types

const SEND_AUTH_REQUEST = 'easytrack/auth/SEND_AUTH_REQUEST';
const STORE_AUTH_TOKENS = 'easytrack/auth/STORE_AUTH_TOKENS';
const SHOW_AUTH_ERROR = 'easytrack/auth/SHOW_AUTH_ERROR';
const REMOVE_AUTH_TOKENS = 'easytrack/auth/REMOVE_AUTH_TOKENS';
// const SEND_TOKEN_REFRESH_REQUEST = 'easytrack/auth/SEND_TOKEN_REFRESH_REQUEST';
const STORE_REFRESHED_TOKEN = 'easytrack/auth/STORE_REFRESHED_TOKEN';
// const SHOW_TOKEN_REFRESH_ERROR = 'easytrack/auth/SHOW_TOKEN_REFRESH_ERROR';

// actions

const sendAuthRequest = () => ({
    type: SEND_AUTH_REQUEST,
})

export const storeAuthTokens = (refresh, access) => ({
    type: STORE_AUTH_TOKENS,
    payload: {
        refresh, 
        access,
    },
})

export const showAuthError = error => ({
    type: SHOW_AUTH_ERROR,
    payload: error,
})

export const removeAuthTokens = () => ({
    type: REMOVE_AUTH_TOKENS,
})

// const sendTokenRefreshRequest = refresh => ({
//     type: SEND_TOKEN_REFRESH_REQUEST,
//     payload: refresh
// })

export const storeRefreshedToken = access => ({
    type: STORE_REFRESHED_TOKEN,
    payload: access,
})

// const showTokenRefreshError = error => ({
//     type: SHOW_TOKEN_REFRESH_ERROR,
//     payload: error,
// })


// operations

export const authenticate = (username, password) => async dispatch => {
    dispatch(sendAuthRequest())
    try {
        const response = await fetch(
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
        if (!response.ok)
            throw new Error(response.status);
        const data = await response.json()
        dispatch(storeAuthTokens(data.refresh, data.access))
    } catch (error) {
        dispatch(showAuthError(error))
    }
}

// reducers

const initialState = {
    refresh: localStorage.getItem('refreshToken'),
    access: localStorage.getItem('accessToken'),
    isAuthenticated: localStorage.getItem('refreshToken') !== null,  // TODO make a selector for it
    inProgress: false,
    error: null,
}

export const authReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch(type) {
        case SEND_AUTH_REQUEST:
            return {...state, inProgress: true}
        case STORE_AUTH_TOKENS:
            localStorage.setItem('refreshToken', payload.refresh)
            localStorage.setItem('accessToken', payload.access)
            return {...state, refresh: payload.refresh, access: payload.access, isAuthenticated: true, inProgress: false}
        case SHOW_AUTH_ERROR:
            return {...state, inProgress: false, error: payload}
        case REMOVE_AUTH_TOKENS:
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            return {...state, refresh: null, access: null, isAuthenticated: false, inProgress: false}
        // case SEND_TOKEN_REFRESH_REQUEST:
        //     break
        case STORE_REFRESHED_TOKEN:
            localStorage.setItem('accessToken', payload)
            return {...state, access: payload}
        // case SHOW_TOKEN_REFRESH_ERROR:
        //     break
        default:
            return state
    }
}

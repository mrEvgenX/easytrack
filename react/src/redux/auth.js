// types

// const SEND_AUTH_REQUEST = 'easytrack/auth/SEND_AUTH_REQUEST';
const STORE_AUTH_TOKENS = 'easytrack/auth/STORE_AUTH_TOKENS';
const SHOW_AUTH_ERROR = 'easytrack/auth/SHOW_AUTH_ERROR';
const REMOVE_AUTH_TOKENS = 'easytrack/auth/REMOVE_AUTH_TOKENS';
// const SEND_TOKEN_REFRESH_REQUEST = 'easytrack/auth/SEND_TOKEN_REFRESH_REQUEST';
const STORE_REFRESHED_TOKEN = 'easytrack/auth/STORE_REFRESHED_TOKEN';
// const SHOW_TOKEN_REFRESH_ERROR = 'easytrack/auth/SHOW_TOKEN_REFRESH_ERROR';

// actions

// const sendAuthRequest = (user, password) => ({
//     type: SEND_AUTH_REQUEST,
//     payload: {
//         user,
//         password
//     }
// })

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

// ... thunks

// reducers

const initialState = {
    refresh: localStorage.getItem('refreshToken'),
    access: localStorage.getItem('accessToken'),
    isAuthenticated: localStorage.getItem('refreshToken') !== null,
}

export const authReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch(type) {
        // case SEND_AUTH_REQUEST:
        //     break
        case STORE_AUTH_TOKENS:
            localStorage.setItem('refreshToken', payload.refresh);
            localStorage.setItem('accessToken', payload.access);
            return {refresh: payload.refresh, access: payload.access, isAuthenticated: true}
        case SHOW_AUTH_ERROR:
            console.log('SHOW AUTH ERROR', payload.error);
            return {refresh: null, access: null, isAuthenticated: false};
        case REMOVE_AUTH_TOKENS:
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            return {refresh: null, access: null, isAuthenticated: false};
        // case SEND_TOKEN_REFRESH_REQUEST:
        //     break
        case STORE_REFRESHED_TOKEN:
            localStorage.setItem('accessToken', payload);
            return {...state, access: payload}
        // case SHOW_TOKEN_REFRESH_ERROR:
        //     break
        default:
            return state
    }
}

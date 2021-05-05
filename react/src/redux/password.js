import {combineReducers} from 'redux'

const baseAPIUrl = '/api/v1/';


// types

const SEND_CHANGE_PASSWORD_REQUEST = 'easytrack/password/SEND_CHANGE_PASSWORD_REQUEST';
const SHOW_CHANGE_PASSWORD_SUCCESS = 'easytrack/password/SHOW_CHANGE_PASSWORD_SUCCESS';
const SHOW_CHANGE_PASSWORD_ERROR = 'easytrack/password/SHOW_CHANGE_PASSWORD_ERROR';

// actions

const sendChangePasswordRequest = () => ({
    type: SEND_CHANGE_PASSWORD_REQUEST,
})

export const showChangePasswordSuccess = () => ({
    type: SHOW_CHANGE_PASSWORD_SUCCESS,
})

export const showChangePasswordError = (error) => ({
    type: SHOW_CHANGE_PASSWORD_ERROR,
    payload: error,
})

// operations

export const changePassword = (access, oldPassword, newPassword, newPasswordRepeat) => async dispatch => {
    dispatch(sendChangePasswordRequest())
    try {
        const response = await fetch(
            `${baseAPIUrl}auth/password/change`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: newPassword,
                new_password_repeat: newPasswordRepeat,
            })
        })
        if (!response.ok){
            const error = await response.json()
            throw new Error(response.status + ': ' + JSON.stringify(error))
        }
        dispatch(showChangePasswordSuccess())
    } catch (error) {
        dispatch(showChangePasswordError(error))
    }
}

// reducers

const initialState = {
    inProgress: false,
    error: null,
}

const changePasswordReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch(type) {
        case SEND_CHANGE_PASSWORD_REQUEST:
            return {...state, inProgress: true}
        case SHOW_CHANGE_PASSWORD_SUCCESS:
            return {...state, inProgress: false, error: null}
        case SHOW_CHANGE_PASSWORD_ERROR:
            return {...state, inProgress: false, error: payload}
        default:
            return state
    }
}

export const passwordReducer = combineReducers({
    changePassword: changePasswordReducer,
})

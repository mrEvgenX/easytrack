import React from 'react'
import {Redirect} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import LoginComponent from '../components/auth/Login';
import {authenticate} from '../redux/auth'
import {clearData} from '../redux/data'


const Login = () => {
    const isAuthenticated = useSelector(state => state.auth.refresh != null)
    const authError = useSelector(state => state.auth.error)
    const dispatch = useDispatch()

    const onLogin = async (username, password) => {
        await dispatch(authenticate(username, password))
        if (authError != null) {
            dispatch(clearData())
            return true
        }
        return false
    }

    if (isAuthenticated) {
        return <Redirect to="/" />;
    }
    return <LoginComponent onLogin={onLogin}/>
}

export default Login

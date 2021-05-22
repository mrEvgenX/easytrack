import React, {useState, useEffect} from 'react'
import { Redirect } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {changePassword} from '../redux/password'
import TelegramConnection from '../components/settings/TelegramConnection'
import PasswordChangingForm from '../components/settings/PasswordChangingForm'


const obtainTelegramConnectionData = async (access) => {
    const baseAPIUrl = '/api/v1/';
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


const sendTestTelegramMessage = (access) => {
    const baseAPIUrl = '/api/v1/';
    return fetch(
        baseAPIUrl + 'telegram/test_message/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${access}`
        }
    })
}


const detachTelegramAccount = (access) => {
    const baseAPIUrl = '/api/v1/';
    return fetch(
        baseAPIUrl + 'telegram/connection/detach', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Bearer ${access}`
        }
    })
}


const Settings = () => {
    const isAuthenticated = useSelector(state => state.auth.refresh != null)
    const access = useSelector(state => state.auth.access)
    const passwordChangingInProgress = useSelector(state => state.password.changePassword.inProgress)
    const passwordChangingErrorOccurred = useSelector(state => state.password.changePassword.error != null)
    const dispatch = useDispatch()
    const [obtainingTelegramConnectionData, setObtainingTelegramConnectionData] = useState(false)
    const [telegramConnected, setTelegramConnectedStatus] = useState()
    const [telegramUsername, setTelegramUsername] = useState()
    const [telegramConnectionLink, setTelegramConnectionLink] = useState()

    useEffect(() => {
        if (isAuthenticated) {
            setObtainingTelegramConnectionData(true)
            obtainTelegramConnectionData(access)
                .then(({connectedStatus, username, connectionLink}) => {
                    setTelegramConnectedStatus(connectedStatus)
                    setTelegramUsername(username)
                    setTelegramConnectionLink(connectionLink)
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    setObtainingTelegramConnectionData(false)
                })
        }
    }, [isAuthenticated, access])

    if (!isAuthenticated) {
        return <Redirect to="/welcome" />;
    }

    const doPasswordChanging = (oldPassword, newPassword, newPasswordRepeat) => {
        dispatch(changePassword(access, oldPassword, newPassword, newPasswordRepeat))
    }

    return (<>
        <div className="container">
            <h2 className="title is-2">Настройки</h2>
            <PasswordChangingForm
                onSubmit={doPasswordChanging}
                passwordChangingInProgress={passwordChangingInProgress}
                passwordChangingErrorOccurred={passwordChangingErrorOccurred} />
            <TelegramConnection
                loading={obtainingTelegramConnectionData}
                connected={telegramConnected}
                telegramUsername={telegramUsername}
                telegramConnectionLink={telegramConnectionLink}
                sendTestTelegramMessage={() => sendTestTelegramMessage(access)}
                detachTelegramAccount={() => {
                    return new Promise((resolve, reject) => {
                        detachTelegramAccount(access)
                            .then(() => {
                                setTelegramConnectedStatus(null)
                                setTelegramUsername(null)
                                setTelegramConnectionLink(null)
                                resolve()
                            })
                            .catch(error => {
                                console.log(error)
                                reject()
                            })
                    })
                }} />
        </div>
    </>)
}

export default Settings

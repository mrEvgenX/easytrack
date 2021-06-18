import React, {useState, useEffect} from 'react'
import { Redirect } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {changePassword} from '../redux/password'
import TelegramConnection from '../components/settings/TelegramConnection'
import PasswordChangingForm from '../components/settings/PasswordChangingForm'


const Settings = props => {
    const {obtainTelegramConnectionData, sendTestTelegramMessage, detachTelegramAccount} = props
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
    }, [isAuthenticated, access, obtainTelegramConnectionData])

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

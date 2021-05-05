import React, {useState} from 'react'
import { Redirect } from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {changePassword} from '../redux/password'


const Settings = () => {
    const isAuthenticated = useSelector(state => state.auth.refresh != null)
    const access = useSelector(state => state.auth.access)
    const passwordChangingInProgress = useSelector(state => state.password.changePassword.inProgress)
    const passwordChangingErrorOccurred = useSelector(state => state.password.changePassword.error != null)
    const dispatch = useDispatch()
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('')

    if (!isAuthenticated) {
        return <Redirect to="/welcome" />;
    }

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(changePassword(access, oldPassword, newPassword, newPasswordRepeat))
            .then(() => {
                // TODO Почему-то не работает
                if (!passwordChangingErrorOccurred) {
                    setOldPassword('')
                    setNewPassword('')
                    setNewPasswordRepeat('')
                }

            })
    }

    return (<>
        <div className="container">
            <h2 className="title is-2">Настройки</h2>
            <h4 className="title is-4">Смена пароля</h4>
            <form onSubmit={onSubmit}>
                <div className="field">
                    <p className="control">
                        <input className="input" type="password" placeholder="Текущий пароль" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <input className="input" type="password" placeholder="Новый пароль" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <input className="input" type="password" placeholder="Новый пароль еще раз" value={newPasswordRepeat} onChange={(e) => setNewPasswordRepeat(e.target.value)} />
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <input className="button is-primary" type="submit" value="Сменить пароль" />
                    </p>
                </div>
                {passwordChangingInProgress? <p className="content">Пожалуйста, подождите</p> : null }
                {/* TODO сделать информативные подсказки о том, что именно не так */}
                {passwordChangingErrorOccurred? <p className="content">Случилась непредвиденная ошибка</p> : null }
            </form>
        </div>
    </>)
}

export default Settings

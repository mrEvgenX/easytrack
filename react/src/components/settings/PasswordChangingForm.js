import React, {useState} from 'react'


const PasswordChangingForm = ({onSubmit, passwordChangingInProgress, passwordChangingErrorOccurred}) => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('')

    const onFormSubmit = (e) => {
        e.preventDefault()
        onSubmit(oldPassword, newPassword, newPasswordRepeat)
    }

    return (
        <div>
            <h4 className="title is-4">Смена пароля</h4>
            <form onSubmit={onFormSubmit}>
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
    )
}


export default PasswordChangingForm

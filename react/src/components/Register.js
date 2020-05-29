import React from 'react';


export default function Login() {
    return (
        <>
            <h2>Вход на сайт</h2>
            <form>
                <div>
                    <input type='text' name='login' placeholder='E-mail' />
                </div>
                <div>
                    <input type='password' name='password' placeholder='Пароль' />
                </div>
                <div>
                    <input type='password' name='password_repeat' placeholder='Пароль еще раз' />
                </div>
                <div>
                    <input type='submit' value='Зарегистрироваться' />
                </div>
            </form>
        </>
    );
}

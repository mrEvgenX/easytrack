import React from 'react';
import { Link } from 'react-router-dom';


export default function HeaderBlock(props) {
    const { logout } = props;
    const handleClick = (e) => {
        e.preventDefault();
        logout()
    }
    return (
        <>
            <h1>Easy Track</h1>
            <p><Link to='/'>Папки</Link></p>
            <p><Link to='/login'>Вход</Link></p>
            <p><Link to='/register'>Регистрация</Link></p>
            <p><a href='/' onClick={handleClick}>Выход</a></p>
            <hr/>
        </>
    );
}

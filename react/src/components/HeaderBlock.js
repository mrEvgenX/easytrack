import React from 'react';
import { Link } from 'react-router-dom';


export default function HeaderBlock(props) {
    const { isAuthenticated, logout } = props;
    const handleClick = (e) => {
        e.preventDefault();
        logout()
    }
    if (!isAuthenticated) {
        return (
            <>
                <h1>Easy Track</h1>
                <p><Link to='/login'>Вход</Link></p>
                <p><Link to='/register'>Регистрация</Link></p>
                <hr/>
            </>
        );
    }
    return (
        <>
            <h1>Easy Track</h1>
            <p><Link to='/'>Папки</Link></p>
            <p><a href='/' onClick={handleClick}>Выход</a></p>
            <hr/>
        </>
    );
}

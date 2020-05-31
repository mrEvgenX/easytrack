import React from 'react';
import { Link } from 'react-router-dom';


export default function HeaderBlockUnlogged() {
    return (
        <>
            <p><Link to='/login'>Вход</Link></p>
            <p><Link to='/register'>Регистрация</Link></p>
        </>
    );
}

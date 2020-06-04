import React from 'react';
import { Link } from 'react-router-dom';


export default function HeaderBlockUnlogged() {
    return (
        <ul>
            <li><Link to='/login'>Вход</Link></li>
            <li><Link to='/register'>Регистрация</Link></li>
        </ul>
    );
}

import React from 'react';
import { Link } from 'react-router-dom';


export default function HeaderMenu(props) {
    const { onLogout } = props;
    const handleClick = (e) => {
        e.preventDefault();
        onLogout()
    }
    return (
        <ul>
            <li><Link to='/'>Главная</Link></li>
            <li><Link to='/statistics'>Статистика</Link></li>
            <li><button onClick={handleClick}>Выход</button></li>
        </ul>
    );
}

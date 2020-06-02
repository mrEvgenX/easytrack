import React from 'react';
import { Link } from 'react-router-dom';


export default function HeaderMenu(props) {
    const { onLogout } = props;
    const handleClick = (e) => {
        e.preventDefault();
        onLogout()
    }
    return (
        <>
            
            <p><Link to='/'>Главная</Link></p>
            <p><Link to='/statistics'>Статистика</Link></p>
            {/* TODO сделать button и прописать стили */}
            <p><a href='#' onClick={handleClick}>Выход</a></p>
        </>
    );
}

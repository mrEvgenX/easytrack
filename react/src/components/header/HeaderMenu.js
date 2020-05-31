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
            <p><Link to='/'>Папки</Link></p>
            <p><a href='/' onClick={handleClick}>Выход</a></p>
        </>
    );
}

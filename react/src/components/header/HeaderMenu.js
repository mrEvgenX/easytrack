import React from 'react';
import { Link } from 'react-router-dom';


export default function HeaderMenu(props) {
    const { isActive, onLogout } = props;
    const handleLogout = (e) => {
        e.preventDefault();
        onLogout()
    }
    return (
        <div id="mainNavbar" className={isActive? "navbar-menu is-active" : "navbar-menu"}>
            <div className="navbar-start">
                <Link className="navbar-item" to="/">Главная</Link>
                <Link className="navbar-item" to="/statistics">Статистика</Link>
            </div>
            <div className="navbar-end">
                <Link className="navbar-item" to="/settings">Настройки</Link>
                <a href="/" className='navbar-item' onClick={handleLogout}>Выход</a>
            </div>
        </div>
    );
}

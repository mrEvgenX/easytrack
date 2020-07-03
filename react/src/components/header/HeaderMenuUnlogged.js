import React from 'react';
import { Link } from 'react-router-dom';


export default function HeaderBlockUnlogged(props) {
    const { isActive } = props;
    return (
        <div id="mainNavbar" className={isActive? "navbar-menu is-active" : "navbar-menu"}>
            <div className="navbar-start">
                <Link className="navbar-item" to='/login'>Вход</Link>
                <Link className="navbar-item" to='/register'>Регистрация</Link>
            </div>
        </div>
    );
}

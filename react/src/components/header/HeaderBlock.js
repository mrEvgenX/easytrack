import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderMenu from './HeaderMenu';
import HeaderMenuUnlogged from './HeaderMenuUnlogged';

export default function HeaderBlock(props) {
    const [menuExpanded, expandMenu ] = useState(false);
    const { isAuthenticated, onLogout } = props;
    const toggleMenu = () => {
        expandMenu(!menuExpanded);
    }

    let headerMenu;
    if (isAuthenticated) {
        headerMenu = < HeaderMenu isActive={menuExpanded} onLogout={onLogout} />;
    } else {
        headerMenu = <HeaderMenuUnlogged isActive={menuExpanded} />;
    }

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link className="navbar-item" to='/'>Easy Track</Link>
                <p role="button" className={menuExpanded? "navbar-burger is-active" : "navbar-burger"} aria-label="menu" aria-expanded="false" data-target="mainNavbar" onClick={toggleMenu}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </p>
            </div>
            { headerMenu }
        </nav>
    );
}

import React from 'react';
import { Link } from 'react-router-dom';


export default function HeaderBlock() {
    return (
        <>
            <h1>Easy Track</h1>
            <p><Link to='/'>Папки</Link></p>
        </>
    );
}

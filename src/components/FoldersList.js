import React from 'react';
import { Link } from 'react-router-dom';


export default function FoldersList() {
    return (
        <>
            <h3>Папки</h3>
            <ul>
                <li><Link to='/folder/odezhda'>Одежда</Link></li>
                <li><Link to='/folder/nabor-privychek'>Набор привычек</Link></li>
            </ul>
        </>
    );
}

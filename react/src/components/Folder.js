import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


export default function Folder(props) {
    let { folder, selected, onClick, onDelete } = props;
    if (folder === null) {
        folder = { slug: '', name: 'Все' }
    }
    const handleFilterChanging = e => {
        onClick(folder.slug)
    }
    const handleDeletion = e => {
        onDelete(folder);
    }
    return (<li>
        <button className={selected? 'selectedFolder' : null} onClick={handleFilterChanging}>{folder.name}</button>
        {folder.slug !== '' ? <button onClick={handleDeletion}><FontAwesomeIcon icon={faTrashAlt} /></button> : null}
    </li>);
}

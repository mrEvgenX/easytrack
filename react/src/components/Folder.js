import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';


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
        <button className={"button " + (selected? 'selectedFolder' : '')} onClick={handleFilterChanging}>{folder.name}</button>
        {folder.slug !== '' ? <button className="button" onClick={handleDeletion}><FontAwesomeIcon icon={faTrashAlt} /></button> : null}
    </li>);
}

import React from 'react';


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
        {folder.slug !== '' ? <button onClick={handleDeletion}>Удалить</button> : null}
    </li>);
}

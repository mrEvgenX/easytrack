import React, { useState } from 'react';
import './ChangeFolderPopup.css'

const ChangeFolderPopup = (props) => {
    const { item, folders, closePopup, putItemInFolder } = props;
    const [selectedFolder, setSelectedFolder] = useState(item.folder !== null? item.folder : '');
    const onClick = e => {
        putItemInFolder(item, selectedFolder);
        closePopup();
    }
    const onChange = e => {
        setSelectedFolder(e.target.value);
    }
    return (<div className="modal">
        <button className="close" onClick={closePopup}>
            &times;
        </button>
        <ul>
            <li>
                <input name="folder" type="radio" value='' checked={selectedFolder === ''} onChange={onChange} />
                <span className={null === item.folder ? 'currentFolder': null}>Без папки</span>
            </li>
            {folders.map(folder =>
                <li key={folder.slug}>
                    <input name="folder" type="radio" value={folder.slug} checked={folder.slug === selectedFolder} onChange={onChange} />
                    <span className={folder.slug === item.folder ? 'currentFolder': null}>{folder.name}</span>
                </li>
            )}
        </ul>
        <button onClick={onClick}>Сохранить</button>
    </div>)
}


export default (item, folders, putItemInFolder) => close => (
    <ChangeFolderPopup item={item}
        folders={folders} 
        closePopup={close} 
        putItemInFolder={putItemInFolder} />
)

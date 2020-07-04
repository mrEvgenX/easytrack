import React, { useState } from 'react';
import './ChangeFolderPopup.css'

const ChangeFolderPopup = (props) => {
    const { item, folders, closePopup, handleDeletion, filtersEnabled, putItemInFolder } = props;
    const [selectedFolder, setSelectedFolder] = useState(item.folder !== null? item.folder : '');
    const onSave = _ => {
        putItemInFolder(item, selectedFolder);
        closePopup();
    }
    const onChange = e => {
        setSelectedFolder(e.target.value);
    }
    return (<>
        <h3 className="title">{item.name}</h3>
        <p className="content">Настроить фильтр</p>
        {filtersEnabled ? <>
        <ul>
            <li>
                <input name="folder" type="radio" value='' checked={selectedFolder === ''} onChange={onChange} />
                <span className={null === item.folder ? 'currentFolder': null}>Без фильтра</span>
            </li>
            {folders.map(folder =>
                <li key={folder.slug}>
                    <input name="folder" type="radio" value={folder.slug} checked={folder.slug === selectedFolder} onChange={onChange} />
                    <span className={folder.slug === item.folder ? 'currentFolder': null}>{folder.name}</span>
                </li>
            )}
        </ul>
        <div className="level">
            <div className="level-left">
                <div className="level-item">
                    <button className="button" onClick={onSave}>Сохранить</button>
                </div>
            </div>
            <div className="level-right">
                <div className="level-item">
                    <button className="button" onClick={closePopup}>Отмена</button>
                </div>
            </div>
        </div>
        </>
        :
        <>
        <p className="content">Эта функция требует наличия хотя бы пяти элементов</p>
        </>
        }
        <p className="content">Удаление элемента</p>
        <div className="container">
        <div class="field">
            <div class="control">
                <input class="input" type="text" placeholder="Подтверждаю" />
            </div>
        </div>
        <button className="button is-danger" onClick={handleDeletion}>Удалить элемент</button>
        </div>
    </>)
}


export default (item, folders, putItemInFolder, filtersEnabled) => (close, handleDeletion) => (
    <ChangeFolderPopup item={item}
        folders={folders}
        filtersEnabled={filtersEnabled}
        closePopup={close}
        handleDeletion={handleDeletion}
        putItemInFolder={putItemInFolder} />
)

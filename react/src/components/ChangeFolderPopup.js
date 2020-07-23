import React, { useState } from 'react';
import './ChangeFolderPopup.css'


const ChangeFolderPopup = (props) => {
    const { item, folders, closePopup, handleDeletion, filtersEnabled, putItemInFolder } = props;
    const [selectedFolder, setSelectedFolder] = useState(item.folder !== null ? item.folder : '');
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const onSave = _ => {
        putItemInFolder(item, selectedFolder);
        closePopup();
    }
    const onChange = e => {
        setSelectedFolder(e.target.value);
    }
    const onDeleteConfirmationTextChanged = e => {
        setDeleteConfirmed(e.target.value.toLowerCase() === 'подтверждаю');
    }
    return (<>
        <h3 className="title">{item.name}</h3>
        <p className="content">Настроить фильтр</p>
        {filtersEnabled ? <>
            <div className="control" style={{ display: 'flex', flexDirection: 'column' }}>
                <label className="radio">
                    <input name="folder" type="radio" value='' checked={selectedFolder === ''} onChange={onChange} />
                    <span className={null === item.folder ? 'currentFolder' : null}>Без фильтра</span>
                </label>
                {folders.map(folder =>
                    <label className="radio" key={folder.slug}>
                        <input name="folder" type="radio" value={folder.slug} checked={folder.slug === selectedFolder} onChange={onChange} />
                        <span className={folder.slug === item.folder ? 'currentFolder' : null}>{folder.name}</span>
                    </label>
                )}
            </div>
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
        <p className="content">Удаление элемента навсегда</p>
        <div className="container">
            <div className="field">
                <div className="control">
                    <input className="input" type="text" placeholder="Подтверждаю" onChange={onDeleteConfirmationTextChanged} />
                </div>
            </div>
            <button className="button is-danger" onClick={handleDeletion} disabled={!deleteConfirmed}>Удалить элемент</button>
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

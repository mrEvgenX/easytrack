import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';


export default function Folder(props) {
    const [modalVisible, setModalVisible] = useState(false);
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
    const showModal = e => {
        setModalVisible(!modalVisible);
    }
    return (<li>
        <button className={"button " + (selected ? 'selectedFolder' : '')} onClick={handleFilterChanging}>{folder.name}</button>
        {folder.slug !== '' ? <button className="button" onClick={showModal}><FontAwesomeIcon icon={faTrashAlt} /></button> : null}
        <div className={"modal " + (modalVisible? "is-active" : "")}>
            <div className="modal-background" onClick={showModal}></div>
            <div className="modal-content">
                <div className="box">
                    <p className="content">Удалить навсегда без возможности восстановления?</p>
                    <button className="button is-danger" onClick={handleDeletion}>OK</button>
                    <button className="button" onClick={showModal}>Отмена</button>
                </div>
            </div>
            <button className="modal-close is-large" onClick={showModal} aria-label="close"></button>
        </div>
    </li>);
}

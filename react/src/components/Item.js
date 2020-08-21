import React, { useState } from 'react';
import './Item.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

export default function Item(props) {
    const { item, onTrack, onDelete, children, checkedToday } = props;
    const [ modalVisible, setModalVisible ] = useState(false);
    const trackElement = _ => {
        if (!checkedToday) {
            onTrack(item.id);
        }
    }
    const handleDeletion = _ => {
        onDelete(item);
    }
    const showModal = _ => {
        setModalVisible(!modalVisible);
    }
    return (
    <div className={"tile content Item " + (checkedToday? "ItemChecked": "")}>
        <div className="ItemButton">
            <button className="button" onClick={trackElement} disabled={checkedToday}>{item.name}</button>
        </div>
        <div className="ItemSettings">
            <button className="button" onClick={showModal}><FontAwesomeIcon icon={faCog} /></button>
        </div>
        <div className={"modal " + (modalVisible? "is-active" : "")}>
            <div className="modal-background" onClick={showModal}></div>
            <div className="modal-content">
                <div className="box">
                    {children(handleDeletion)}
                </div>
            </div>
            <button className="modal-close is-large" onClick={showModal} aria-label="close"></button>
        </div>
    </div>
    );
}

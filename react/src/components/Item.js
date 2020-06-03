import React from 'react';
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

export default function Item(props) {
    const { item, onTrack, onDelete, children } = props;
    const trackElement = _ => {
        onTrack(item.id);
    }
    const handleDeletion = _ => {
        onDelete(item);
    }
    return (<li>
        <button onClick={trackElement}>{item.name}</button>
        <Popup trigger={<button><FontAwesomeIcon icon={faEllipsisV} /></button>} modal position="right center">
            {children}
        </Popup>
        <button onClick={handleDeletion}><FontAwesomeIcon icon={faTrashAlt} /></button>
    </li>);
}

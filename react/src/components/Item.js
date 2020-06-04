import React from 'react';
import './Item.css';
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

export default function Item(props) {
    const { item, onTrack, onDelete, children } = props;
    const trackElement = _ => {
        onTrack(item.id);
    }
    const handleDeletion = _ => {
        onDelete(item);
    }
    return (<li className="Item">
        <div className="ItemButton">
            <button onClick={trackElement}>{item.name}</button>
        </div>
        <div className="ItemSettings">
            <Popup trigger={<button><FontAwesomeIcon icon={faFolder} /></button>} modal position="right center">
                {children}
            </Popup>
            <button onClick={handleDeletion}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>
    </li>);
}

import React from 'react';
import Popup from "reactjs-popup";


export default function Item(props) {
    const { item, onTrack, children } = props;
    const trackElement = _ => {
        onTrack(item.id);
    }
    return (<li>
        {item.name}
        <button onClick={trackElement}>Засчитать</button>
        <Popup trigger={<button>Настроить папку</button>} modal position="right center">
            {children}
        </Popup>
    </li>);
}

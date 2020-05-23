import React from 'react';


export default function ItemsList(props) {
    const folderName = props.match.params.folderName;
    return (
        <>
            <h3>Элементы папки {folderName}</h3>
            <ul>
                <li>Майка</li>
                <li>Джинсы</li>
            </ul>
        </>
    );
}

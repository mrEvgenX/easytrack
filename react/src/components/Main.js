import React, { useEffect } from 'react';
import changeFolderPopup from './ChangeFolderPopup';
import Folder from './Folder';
import FoldersList from './FoldersList';
import Item from './Item';
import ItemsList from './ItemsList';


export default function Main(props) {
    const { 
        populateStateIfNecessary,
        folders, trackedItems, trackEntries, currentFilter,
        changeFilter,
        onFolderCreation,
        onFolderDelete,
        onElementCreation,
        onTrackEntryAddition,
        putItemInFolder,
        onElementDelete
    } = props;
    useEffect(() => {
        populateStateIfNecessary();
    });
    let itemsToBeDisplayed = null;
    if (currentFilter !== '') {
        itemsToBeDisplayed = trackedItems.filter(item => item.folder === currentFilter);
    } else {
        itemsToBeDisplayed = trackedItems;
    }
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const todayTimeBucket = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    itemsToBeDisplayed.forEach(item => {
        const checkedToday = trackEntries.filter(entry => entry.item === item.id && entry.timeBucket === todayTimeBucket);
        item.checkedToday = checkedToday.length === 1;
    })
    return (<>
        <FoldersList createFolder={onFolderCreation}>
            <Folder selected={'' === currentFilter} folder={null} onClick={changeFilter} />
            {folders.map(folder =>
                <Folder key={folder.slug} selected={folder.slug === currentFilter} folder={folder} onClick={changeFilter} onDelete={onFolderDelete} />
            )}
        </FoldersList>
        <ItemsList createElement={onElementCreation}>
            {itemsToBeDisplayed.map(item =>
                <Item key={item.id} item={item} onTrack={onTrackEntryAddition} onDelete={onElementDelete} checkedToday={item.checkedToday}>
                    {changeFolderPopup(item, folders, putItemInFolder)}
                </Item>
            )}
        </ItemsList>
    </>)
}
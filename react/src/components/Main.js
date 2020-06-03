import React from 'react';
import changeFolderPopup from './ChangeFolderPopup'
import { Redirect } from 'react-router-dom';
import Folder from './Folder';
import FoldersList from './FoldersList';
import Item from './Item';
import ItemsList from './ItemsList';


export default function Main(props) {

    const { 
        folders, trackedItems, isAuthenticated, currentFilter,
        changeFilter,
        onFolderCreation,
        onFolderDelete,
        onElementCreation,
        onTrackEntryAddition,
        putItemInFolder,
        onElementDelete
    } = props;
    if (!isAuthenticated) {
        return <Redirect to="/welcome" />
    }
    let itemsToBeDisplayed = null;
    if (currentFilter !== '') {
        itemsToBeDisplayed = trackedItems.filter(item => item.folder === currentFilter);
    } else {
        itemsToBeDisplayed = trackedItems;
    }
    return (<>
        <FoldersList createFolder={onFolderCreation}>
            <Folder selected={'' === currentFilter} folder={null} onClick={changeFilter} />
            {folders.map(folder =>
                <Folder key={folder.slug} selected={folder.slug === currentFilter} folder={folder} onClick={changeFilter} onDelete={onFolderDelete} />
            )}
        </FoldersList>
        <ItemsList createElement={onElementCreation}>
            {itemsToBeDisplayed.map(item =>
                <Item key={item.id} item={item} onTrack={onTrackEntryAddition} onDelete={onElementDelete}>
                    {changeFolderPopup(item, folders, putItemInFolder)}
                </Item>
            )}
        </ItemsList>
    </>)
}
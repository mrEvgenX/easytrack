import React from 'react';
import {Switch, Route} from 'react-router-dom';
import FoldersList from './FoldersList';
import ItemsList from './ItemsList';
import ItemsListStat from './ItemsListStat';

export default function Main(props) {
    const { globalState: { folders, trackedItems, trackEntries, createFolder, createElement, addTrackEntry } } = props;
    return (
        <Switch>
            <Route exact path="/" 
                   render={() => <FoldersList folders={folders} createFolder={createFolder} />} />
            <Route path="/folder/:folderSlug/statistics" 
                   render={props => <ItemsListStat {...props} folders={folders} trackedItems={trackedItems} trackEntries={trackEntries} createElement={createElement} />} />
            <Route path="/folder/:folderSlug" 
                   render={props => <ItemsList {...props} folders={folders} trackedItems={trackedItems} createElement={createElement} addTrackEntry={addTrackEntry} />} />
        </Switch>
    );
}

import React from 'react';
import {Switch, Route} from 'react-router-dom';
import FoldersList from './FoldersList';
import ItemsList from './ItemsList';

export default function Main(props) {
    const { globalState: { folders, trackedItems, createFolder, createElement } } = props;
    return (
        <Switch>
            <Route exact path="/" render={() => <FoldersList folders={folders} createFolder={createFolder} />} />
            <Route path="/folder/:folderSlug" render={props => <ItemsList {...props} folders={folders} trackedItems={trackedItems} createElement={createElement} />} />
        </Switch>
    );
}

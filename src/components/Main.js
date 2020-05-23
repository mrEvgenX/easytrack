import React from 'react';
import {Switch, Route} from 'react-router-dom';
import FoldersList from './FoldersList';
import ItemsList from './ItemsList';

export default function Main() {
    return (
        <Switch>
            <Route exact path="/" component={FoldersList} />
            <Route path="/folder/:folderName" component={ItemsList} />
        </Switch>
    );
}

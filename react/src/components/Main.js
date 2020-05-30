import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import FoldersList from './FoldersList';
import ItemsList from './ItemsList';
import ItemsListStat from './ItemsListStat';
import Login from './Login';
import Register from './Register';

export default function Main(props) {
    const { globalState: { folders, trackedItems, trackEntries, createFolder, createElement, addTrackEntry, authenticate, auth: { isAuthenticated } } } = props;
    return (
        <Switch>
            <Route exact path="/" 
                   render={() => {
                        if (!isAuthenticated) {
                            return <Redirect to="/login" />
                        }
                        return <FoldersList folders={folders} createFolder={createFolder} />
                   }} />
            <Route path="/folder/" 
                   render={() => {
                        if (!isAuthenticated) {
                            return <Redirect to="/login" />
                        }
                        return (<Switch>
                            <Route path="/folder/:folderSlug/statistics" 
                                render={props => <ItemsListStat {...props} folders={folders} trackedItems={trackedItems} trackEntries={trackEntries} createElement={createElement} />} />
                            <Route path="/folder/:folderSlug" 
                                render={props => <ItemsList {...props} folders={folders} trackedItems={trackedItems} createElement={createElement} addTrackEntry={addTrackEntry} />} />
                        </Switch>)
                   }} />
            <Route exact path="/login" render={() => <Login isAuthenticated={isAuthenticated} authenticate={authenticate} />} />
            <Route exact path="/register" component={Register} />
            <Route render={() => <h1>Такой страницы нет</h1>} />
        </Switch>
    );
}

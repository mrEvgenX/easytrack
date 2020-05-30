import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import FoldersList from './FoldersList';
import ItemsList from './ItemsList';
import ItemsListStat from './ItemsListStat';
import Login from './Login';
import Register from './Register';
import WelcomeBlock from './WelcomeBlock';

export default function Main(props) {
    const { globalState: { 
        folders, trackedItems, trackEntries, createFolder, createElement, addTrackEntry, 
        authenticate, register, auth: { isAuthenticated, authenticationAttemptFailed, registrationFailed } 
    } } = props;
    return (
        <Switch>
            <Route exact path="/" 
                   render={() => {
                        if (!isAuthenticated) {
                            return <Redirect to="/welcome" />
                        }
                        return <FoldersList folders={folders} createFolder={createFolder} />
                   }} />
            <Route exact path="/welcome" component={ WelcomeBlock } />
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
            <Route exact path="/login" render={() => <Login authenticationAttemptFailed={authenticationAttemptFailed} isAuthenticated={isAuthenticated} authenticate={authenticate} />} />
            <Route exact path="/register" render={() => <Register registrationFailed={registrationFailed} register={register} />} />
            <Route render={() => <h1>Такой страницы нет</h1>} />
        </Switch>
    );
}

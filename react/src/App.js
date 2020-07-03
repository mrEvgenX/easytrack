import React from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import './App.css';
import HeaderBlock from './components/header/HeaderBlock';
import ItemsListStat from './components/ItemsListStat';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WelcomeBlock from './components/WelcomeBlock';
import Main from './components/Main';
import EmailConfirmation from './components/EmailConfirmation';


function PrivateRoute({ isAuthenticated, render, ...rest }) {
    return <Route {...rest} render={
        (props) => {
            if (!isAuthenticated) {
                return <Redirect to="/welcome" />;
            }
            return render(props);
        }
    } />
}


function OneMoreStep({isAuthenticated}) {
    // TODO надо никогда не пускать на эту страницу, если только что не завершалась регистрация
    if (isAuthenticated) {
        return <Redirect to="/" />;
    }
    return <h2>Вам направлено письмо с инструкцией для завершения регистрации</h2>
}


function NotFoundPage() {
    return <h1>Такой страницы нет</h1>
}


export default function App(props) {
    const {
        populateStateIfNecessary,
        folders,
        trackedItems,
        trackEntries,
        currentFilter,
        isAuthenticated,
        changeFilter,
        onFolderCreation,
        onFolderDelete,
        onElementCreation,
        onTrackEntryAddition,
        putItemInFolder,
        onElementDelete,
        applyEntriesChanging,
        onLogin,
        onLogout,
        onRegister
    } = props;
    return (
        <BrowserRouter>
            <div className="App" >
                <HeaderBlock isAuthenticated={isAuthenticated} onLogout={onLogout} />
                <Switch>
                    <PrivateRoute isAuthenticated={isAuthenticated} exact path="/" render={
                        () => <Main
                            populateStateIfNecessary={populateStateIfNecessary}
                            folders={folders}
                            trackedItems={trackedItems}
                            trackEntries={trackEntries}
                            currentFilter={currentFilter}
                            changeFilter={changeFilter}
                            onFolderCreation={onFolderCreation}
                            onFolderDelete={onFolderDelete}
                            onElementCreation={onElementCreation}
                            onTrackEntryAddition={onTrackEntryAddition}
                            putItemInFolder={putItemInFolder}
                            onElementDelete={onElementDelete} />
                    } />
                    <PrivateRoute isAuthenticated={isAuthenticated} exact path="/statistics" render={
                        () => <ItemsListStat
                            populateStateIfNecessary={populateStateIfNecessary}
                            trackedItems={trackedItems}
                            trackEntries={trackEntries}
                            applyEntriesChanging={applyEntriesChanging} />
                    }
                    />
                    <Route exact path="/welcome" component={WelcomeBlock} />
                    <Route exact path="/login"
                        render={
                            () => {
                                if (isAuthenticated) {
                                    return <Redirect to="/" />;
                                }
                                return <Login onLogin={onLogin}/>
                            }
                        } />
                    <Route exact path="/register"
                        render={
                            () => {
                                if (isAuthenticated) {
                                    return <Redirect to="/" />;
                                }
                                return <Register onRegister={onRegister} />
                            }
                        } />
                    <Route exact path="/one-more-step" render={
                        () => <OneMoreStep isAuthenticated={isAuthenticated} />
                    } />
                    <Route path="/confirm/:user_id/:token" render={
                        ({ match: { params: { user_id, token } } }) => <EmailConfirmation userId={user_id} token={token} />
                    } />
                    <Route component={NotFoundPage} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

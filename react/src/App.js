import React from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import './App.css';
import HeaderBlock from './components/header/HeaderBlock';
import HeaderMenu from './components/header/HeaderMenu';
import HeaderMenuUnlogged from './components/header/HeaderMenuUnlogged';
import ItemsListStat from './components/ItemsListStat';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WelcomeBlock from './components/WelcomeBlock';
import Main from './components/Main';
import EmailConfirmation from './components/EmailConfirmation';


function PrivateRoute({isAuthenticated, render, ...rest}) {
    return <Route {...rest} render={
        (props) => {
            if (!isAuthenticated) {
                return <Redirect to="/welcome" />;
            }
            return render(props);
        }
    } />
}


export default function App(props) {
    const {
        populateStateIfNecessary,
        folders,
        trackedItems,
        trackEntries,
        currentFilter,
        isAuthenticated,
        authenticationAttemptFailed,
        registrationFailed,
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
    let headerMenu;
    if (isAuthenticated) {
        headerMenu = < HeaderMenu onLogout={onLogout} />;
    } else {
        headerMenu = <HeaderMenuUnlogged />;
    }
    return (
        <BrowserRouter>
            <div className="App" >
                <HeaderBlock >
                    {headerMenu}
                </HeaderBlock>
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
                                return <Login
                                    authenticationAttemptFailed={authenticationAttemptFailed}
                                    isAuthenticated={isAuthenticated}
                                    onLogin={onLogin}
                                />
                            }
                        } />
                    <Route exact path="/register"
                        render={
                            () => {
                                if (isAuthenticated) {
                                    return <Redirect to="/" />;
                                }
                                if (registrationFailed !== null && !registrationFailed) {
                                    return <Redirect to="/one-more-step" />;
                                }
                                return (<>
                                    <Register registrationFailed={registrationFailed} onRegister={onRegister} />
                                </>)
                            }
                        } />
                    <Route exact path="/one-more-step"
                        render={
                            () => {
                                // TODO надо никогда не пускать на эту страницу, если только что не завершалась регистрация
                                if (isAuthenticated) {
                                    return <Redirect to="/" />;
                                }
                                return <h2>Вам направлено письмо с инструкцией для завершения регистрации</h2>
                            }
                        } />
                    <Route path="/confirm/:user_id/:token" render={
                        ({match: {params: {user_id, token}}}) => <EmailConfirmation userId={user_id} token={token} />
                    } />
                    <Route render={() => <h1>Такой страницы нет</h1>} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

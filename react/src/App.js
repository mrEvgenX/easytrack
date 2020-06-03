import React, {
    Component
} from 'react';
import './App.css';
import {
    populateState, refreshAccess, createNewUser, requestAndStoreCredentials, clearCredentialsFromStore,
    createFolder, createElement, addTrackEntry
} from './asyncOperations';
import HeaderBlock from './components/header/HeaderBlock';
import HeaderMenu from './components/header/HeaderMenu';
import HeaderMenuUnlogged from './components/header/HeaderMenuUnlogged';
import {
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom';
import FoldersList from './components/FoldersList';
import Item from './components/Item';
import ItemsList from './components/ItemsList';
import ItemsListStat from './components/ItemsListStat';
import Login from './components/auth/Login';
import Register from './components/Register';
import WelcomeBlock from './components/WelcomeBlock';


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: {
                // TODO Incapsulate every call to localstorage
                refresh: localStorage.getItem('refreshToken'),
                access: localStorage.getItem('accessToken'),
                isAuthenticated: localStorage.getItem('refreshToken') !== null,
                authenticationAttemptFailed: false,
                registrationFailed: null
            },
            folders: [],
            trackedItems: [],
            trackEntries: [],
        };
        populateState(this.state.auth.access)
            .then(data => {
                this.setState(data)
            })
            .catch(_ => {
                refreshAccess(this.state.auth.refresh)
                    .then(data => {
                        this.setState({
                            auth: {
                                ...this.state.auth,
                                access: data.access
                            }
                        });
                        populateState(this.state.auth.access).then(data => {
                            this.setState(data)
                        });
                    }).catch(error => {
                        console.log(error);
                    });
            });
    }

    onLogin = (username, password) => {
        requestAndStoreCredentials(username, password)
            .then(data => {
                this.setState({
                    auth: {
                        ...data,
                        isAuthenticated: true
                    }
                });
                populateState(data.auth.access).then(data => {
                    this.setState(data)
                });
            })
            .catch(error => {
                this.setState({
                    auth: {
                        ...this.state.auth,
                        authenticationAttemptFailed: true,
                        registrationFailed: null
                    }
                });
                console.log(error);
            });
    }

    onLogout = () => {
        clearCredentialsFromStore();
        this.setState({
            auth: {
                ...this.state.auth,
                refresh: null,
                access: null,
                isAuthenticated: false,
                registrationFailed: null
            },
            folders: [],
            trackedItems: [],
            trackEntries: [],
        });
    }

    onRegister = (login, password) => {
        createNewUser(login, password)
            .then(data => {
                console.log(data);
                this.setState({
                    auth: {
                        ...this.state.auth,
                        registrationFailed: false
                    }
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    auth: {
                        ...this.state.auth,
                        registrationFailed: true
                    }
                });
            });
    }

    onFolderCreation = (name) => {
        createFolder(this.state.auth.access, name)
            .then(data => {
                this.setState({
                    folders: [...this.state.folders, data]
                })
            });
    }

    onElementCreation = (name, folder) => {
        createElement(this.state.auth.access, folder, name)
            .then(data => {
                this.setState({
                    trackedItems: [...this.state.trackedItems, data]
                })
            });
    }

    onTrackEntryAddition = (itemId) => {
        const now = new Date()
        const month = now.getMonth() + 1
        const timeBucket = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${now.getDate()}`
        addTrackEntry(this.state.auth.access, timeBucket, itemId)
            .then(data => {
                this.setState({
                    trackEntries: [...this.state.trackEntries, data]
                })
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        const {
            folders,
            trackedItems,
            trackEntries,
            auth: {
                isAuthenticated,
                authenticationAttemptFailed,
                registrationFailed
            }
        } = this.state;
        let headerMenu;
        if (isAuthenticated) {
            headerMenu = < HeaderMenu onLogout={this.onLogout} />;
        } else {
            headerMenu = <HeaderMenuUnlogged />;
        }
        return (
            <div className="App" >
                <HeaderBlock >
                    {headerMenu}
                </HeaderBlock>
                <Switch>
                    <Route exact path="/"
                        render={
                            () => {
                                if (!isAuthenticated) {
                                    return <Redirect to="/welcome" />
                                }
                                return (<>
                                    <FoldersList createFolder={this.onFolderCreation}>
                                        {folders.map(item =>
                                            <li key={item.slug}><Link to={'/folder/' + item.slug}>{item.name}</Link></li>
                                        )}
                                    </FoldersList>
                                    <ItemsList createElement={this.onElementCreation}>
                                        {trackedItems.map(item =>
                                            <Item key={item.id} item={item} onTrack={this.onTrackEntryAddition}>
                                                {close => (
                                                    <div className="modal">
                                                        <a className="close" onClick={close}>
                                                            &times;
                                                        </a>
                                                        <ul>
                                                            <li>
                                                                <input name="folder" type="radio" value='' checked={item.folder === null} />Без папки
                                                            </li>
                                                            {folders.map(folder =>
                                                                <li key={folder.slug}>
                                                                    <input name="folder" type="radio" value={folder.slug} checked={folder.slug === item.folder} />{folder.name}
                                                                </li>
                                                            )}
                                                        </ul>
                                                        <button>Сохранить</button>
                                                    </div>
                                                )}
                                            </Item>
                                        )}
                                    </ItemsList>
                                </>)
                            }
                        } />
                    <Route exact path="/welcome" component={WelcomeBlock} />
                    <Route exact path="/statistics"
                        render={
                            () => {
                                if (!isAuthenticated) {
                                    return <Redirect to="/login" />
                                }
                                return (
                                    <ItemsListStat trackedItems={trackedItems}
                                        trackEntries={trackEntries} />
                                )
                            }
                        }
                    />
                    <Route exact path="/login"
                        render={
                            () => {
                                if (isAuthenticated) {
                                    return <Redirect to="/" />;
                                }
                                return <Login
                                    authenticationAttemptFailed={authenticationAttemptFailed}
                                    isAuthenticated={isAuthenticated}
                                    onLogin={this.onLogin}
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
                                    return <Redirect to="/login" />;
                                }
                                return (<>
                                    <h3>Статистика по элементам</h3>
                                    <Register registrationFailed={registrationFailed} onRegister={this.onRegister} />
                                </>)
                            }
                        } />
                    <Route render={() => <h1>Такой страницы нет</h1>} />
                </Switch>
            </div>
        );
    }

}
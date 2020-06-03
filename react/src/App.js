import React, {
    Component
} from 'react';
import './App.css';
import {
    populateState, refreshAccess, createNewUser, requestAndStoreCredentials, clearCredentialsFromStore,
    createFolder, createElement, addTrackEntry, putElementInFolder, deleteElement, deleteFolder
} from './asyncOperations';
import HeaderBlock from './components/header/HeaderBlock';
import HeaderMenu from './components/header/HeaderMenu';
import HeaderMenuUnlogged from './components/header/HeaderMenuUnlogged';
import {
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import ItemsListStat from './components/ItemsListStat';
import Login from './components/auth/Login';
import Register from './components/Register';
import WelcomeBlock from './components/WelcomeBlock';
import Main from './components/Main';


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
            currentFilter: '',
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

    onFolderDelete = folder => {
        deleteFolder(this.state.auth.access, folder.slug)
            .then(() => {
                this.setState(prevState => {
                    const folderPos = prevState.folders.indexOf(folder);
                    prevState.folders.splice(folderPos, 1);
                    return prevState;
                })
            });
        console.log(`folder with #${folder.slug} will be deleted`);
    }

    onElementCreation = (name, folder) => {
        if (folder === null && this.state.currentFilter !== '') {
            folder = this.state.currentFilter;
        }
        createElement(this.state.auth.access, folder, name)
            .then(data => {
                this.setState({
                    trackedItems: [...this.state.trackedItems, data]
                })
            });
    }

    onElementDelete = (item) => {
        deleteElement(this.state.auth.access, item.id)
            .then(() => {
                this.setState(prevState => {
                    const itemPos = prevState.trackedItems.indexOf(item);
                    prevState.trackedItems.splice(itemPos, 1);
                    return prevState;
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

    putItemInFolder = (item, folder) => {
        putElementInFolder(this.state.auth.access, item.id, folder)
            .then(data => {
                this.setState(prevState => {
                    const itemPos = prevState.trackedItems.indexOf(item);
                    prevState.trackedItems[itemPos].folder = data.folder;
                    return prevState;
                })
            })
    }

    changeFilter = folderSlug => {
        this.setState({ currentFilter: folderSlug });
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
                    <Route exact path="/" render={
                        () => <Main folders={folders}
                            trackedItems={trackedItems}
                            isAuthenticated={this.state.auth.isAuthenticated}
                            currentFilter={this.state.currentFilter}
                            changeFilter={this.changeFilter}
                            onFolderCreation={this.onFolderCreation}
                            onFolderDelete={this.onFolderDelete}
                            onElementCreation={this.onElementCreation}
                            onTrackEntryAddition={this.onTrackEntryAddition}
                            putItemInFolder={this.putItemInFolder}
                            onElementDelete={this.onElementDelete} />
                    } />
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
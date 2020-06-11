import React, {
    Component
} from 'react';
import {
    populateState, refreshAccess, createNewUser, requestAndStoreCredentials, clearCredentialsFromStore,
    createFolder, createElement, addTrackEntry, putElementInFolder, deleteElement, deleteFolder, bulkUpdateTrackEntries
} from './asyncOperations';
import App from './App';


function actOrRefreshToken(func, refreshToken, accessRefresher) {
    return async (accessToken, ...args) => {
        try {
            return await func(accessToken, ...args);
        } catch(err) {
            const { access: newAccessToken } = await refreshAccess(refreshToken);
            accessRefresher(newAccessToken);
            return null;
        }
    }
}


function actRefreshingTokenIfNecessary(func, refreshToken, accessRefresher) {
    return async (accessToken, ...args) => {
        try {
            return await func(accessToken, ...args);
        } catch(err) {
            const { access: newAccessToken } = await refreshAccess(refreshToken);
            accessRefresher(newAccessToken);
            return await func(newAccessToken, ...args);
        }
    }
}


export default class AppContainer extends Component {

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
    }

    accessRefresher = newAccessToken => {
        this.setState(prevState => {
            prevState.auth.access = newAccessToken;
            return prevState;
        });
    }

    populateStateIfNecessary = () => {
        const { auth: { isAuthenticated }, folders, trackedItems, trackEntries } = this.state;
        if (
            isAuthenticated 
            && folders.length === 0 
            && trackedItems.length === 0 
            && trackEntries.length === 0
        ) {
            actOrRefreshToken(
                populateState, this.state.auth.refresh, this.accessRefresher
            )(this.state.auth.access)
                .then(data => {
                    if (data !== null) {
                        this.setState(data)
                    }
                });
        }
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
        actRefreshingTokenIfNecessary(
            createFolder, this.state.auth.refresh, this.accessRefresher
        )(this.state.auth.access, name)
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
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const timeBucket = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        addTrackEntry(this.state.auth.access, timeBucket, itemId)
            .then(data => {
                this.setState(prevState => {
                    prevState.trackEntries = [...prevState.trackEntries, data];
                    return prevState;
                })
            })
            .catch(error => {
                console.log(error);
            });
    }

    onTrackEntryBackdating = (entriesToBeAdded) => {
        this.setState(prevState => {
            prevState.trackEntries = [...prevState.trackEntries, ...entriesToBeAdded];
            return prevState;
        })
        console.log(entriesToBeAdded);
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

    applyEntriesChanging = (trackEntriesToAdd, trackEntriesToRemove) => {
        bulkUpdateTrackEntries(this.state.auth.access, trackEntriesToAdd, trackEntriesToRemove)
            .then(() => {
                this.setState(prevState => {
                    trackEntriesToAdd.forEach(({item, timeBucket}) => {
                        const entryPos = prevState.trackEntries.findIndex(
                            ({item: currentItem, timeBucket: currentTimeBucket}) => {
                            return currentItem === item && currentTimeBucket === timeBucket;
                        });
                        if (entryPos === -1) {
                            prevState.trackEntries.push({timeBucket, item});
                        }
                    });
                    trackEntriesToRemove.forEach(({item, timeBucket}) => {
                        const entryPos = prevState.trackEntries.findIndex(
                            ({item: currentItem, timeBucket: currentTimeBucket}) => {
                            return currentItem === item && currentTimeBucket === timeBucket;
                        });
                        if (entryPos !== -1) {
                            prevState.trackEntries.splice(entryPos, 1);
                        }
                    });
                    return prevState;
                })
                console.log('save results', trackEntriesToAdd, trackEntriesToRemove);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        return <App
            populateStateIfNecessary={this.populateStateIfNecessary}
            folders={this.state.folders}
            trackedItems={this.state.trackedItems}
            trackEntries={this.state.trackEntries}
            isAuthenticated={this.state.auth.isAuthenticated}
            currentFilter={this.state.currentFilter}
            changeFilter={this.changeFilter}
            onFolderCreation={this.onFolderCreation}
            onFolderDelete={this.onFolderDelete}
            onElementCreation={this.onElementCreation}
            onTrackEntryAddition={this.onTrackEntryAddition}
            putItemInFolder={this.putItemInFolder}
            onElementDelete={this.onElementDelete}
            authenticationAttemptFailed={this.authenticationAttemptFailed}
            registrationFailed={this.registrationFailed}
            applyEntriesChanging={this.applyEntriesChanging}
            onLogin={this.onLogin}
            onLogout={this.onLogout}
            onRegister={this.onRegister}
            />;
    }

}

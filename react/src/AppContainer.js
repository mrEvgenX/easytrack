import React, {
    Component
} from 'react';
import {
    populateState, refreshAccess, createNewUser, requestAndStoreCredentials, clearCredentialsFromStore,
    createElement, addTrackEntry, deleteElement, bulkUpdateTrackEntries,
    AccessTokenExpiredError
} from './asyncOperations';
import { UserAlreadyExists, RegistrationFormValidationError, EmailNotVerified } from './exceptions'
import App from './App';


function actRefreshingTokenIfNecessary(func, refreshToken, accessRefresher) {
    return async (accessToken, ...args) => {
        try {
            return await func(accessToken, ...args);
        } catch(err) {
            if (err instanceof AccessTokenExpiredError) {
                const { access: newAccessToken } = await refreshAccess(refreshToken);
                accessRefresher(newAccessToken);
                return await func(newAccessToken, ...args);
            } else
                throw err;
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
            },
            needToFetchData: true,
            trackedItems: [],
            trackEntries: [],
        };
    }

    accessRefresher = newAccessToken => {
        this.setState(prevState => {
            prevState.auth.access = newAccessToken;
            return prevState;
        });
    }

    populateStateIfNecessary = () => {
        const { auth: { isAuthenticated }, needToFetchData } = this.state;
        if (
            isAuthenticated && needToFetchData
        ) {
            this.setState({needToFetchData: false});
            actRefreshingTokenIfNecessary(
                populateState, this.state.auth.refresh, this.accessRefresher
            )(this.state.auth.access)
                .then(data => {
                    if (data !== null) {
                        this.setState(data)
                    }
                });
        }
    }

    onLogin = async (username, password) => {
        try {
            const loginData = await requestAndStoreCredentials(username, password);
            this.setState({
                auth: {
                    ...loginData,
                    isAuthenticated: true,  
                },
                needToFetchData: true,
            });
            return true;
        } catch (error) {
            this.setState({
                auth: {
                    isAuthenticated: false
                }
            });
            console.log(error);
        }
        return false;
    }

    onLogout = () => {
        clearCredentialsFromStore();
        this.setState({
            auth: {
                refresh: null,
                access: null,
                isAuthenticated: false
            },
            needToFetchData: true,
            trackedItems: [],
            trackEntries: [],
        });
    }

    onRegister = async (login, password) => {
        let result = {
            userAlreadyExists: false,
            emailNotVerified: false,
            notValidForm: false,
            registrationSucceeded: false
        }
        try {
            await createNewUser(login, password);
            result.registrationSucceeded = true;
        } catch(error) {
            if (error instanceof RegistrationFormValidationError) {
                result.notValidForm = true;
            } else if (error instanceof UserAlreadyExists) {
                result.userAlreadyExists = true;
            } else if (error instanceof EmailNotVerified) {
                result.registrationSucceeded = true;
                result.emailNotVerified = true;
            } else {
                throw error;
            }
        }
        return result;
    }

    onElementCreation = (name) => {
        actRefreshingTokenIfNecessary(
            createElement, this.state.auth.refresh, this.accessRefresher
        )(this.state.auth.access, name)
            .then(data => {
                this.setState({
                    trackedItems: [...this.state.trackedItems, data]
                })
            })
            .catch(error => {
                console.log(error);
            });
    }

    onElementDelete = (item) => {
        actRefreshingTokenIfNecessary(
            deleteElement, this.state.auth.refresh, this.accessRefresher
        )(this.state.auth.access, item.id)
            .then(() => {
                this.setState(prevState => {
                    const itemPos = prevState.trackedItems.indexOf(item);
                    prevState.trackedItems.splice(itemPos, 1);
                    return prevState;
                })
            })
            .catch(error => {
                console.log(error);
            });
    }

    onTrackEntryAddition = (itemId) => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const timeBucket = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        actRefreshingTokenIfNecessary(
            addTrackEntry, this.state.auth.refresh, this.accessRefresher
        )(this.state.auth.access, timeBucket, itemId)
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

    applyEntriesChanging = (trackEntriesToAdd, trackEntriesToRemove) => {
        actRefreshingTokenIfNecessary(
            bulkUpdateTrackEntries, this.state.auth.refresh, this.accessRefresher
        )(this.state.auth.access, trackEntriesToAdd, trackEntriesToRemove)
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
            trackedItems={this.state.trackedItems}
            trackEntries={this.state.trackEntries}
            isAuthenticated={this.state.auth.isAuthenticated}
            onElementCreation={this.onElementCreation}
            onTrackEntryAddition={this.onTrackEntryAddition}
            onElementDelete={this.onElementDelete}
            applyEntriesChanging={this.applyEntriesChanging}
            onLogin={this.onLogin}
            onLogout={this.onLogout}
            onRegister={this.onRegister}
            />;
    }

}

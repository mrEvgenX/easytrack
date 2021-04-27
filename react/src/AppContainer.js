import React, {
    Component
} from 'react';
import {connect} from 'react-redux';
import {
    populateState, createNewUser,
    createElement, addTrackEntry, deleteElement, bulkUpdateTrackEntries,
    AccessTokenExpiredError
} from './asyncOperations';
import { UserAlreadyExists, RegistrationFormValidationError, EmailNotVerified } from './exceptions'
import App from './App';
import {storeAuthTokens, storeRefreshedToken, showAuthError, removeAuthTokens, authenticate, refreshAccess} from './redux/auth';


class AppContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            needToFetchData: true,
            trackedItems: [],
            trackEntries: [],
        };
    }

    actRefreshingTokenIfNecessary = func => {
        return async (...args) => {
            try {
                return await func(this.props.auth.access, ...args);
            } catch(err) {
                if (err instanceof AccessTokenExpiredError) {
                    await this.props.refreshAccess(this.props.auth.refresh)
                    if (this.props.auth.error != null) {
                        throw this.props.auth.error
                    }
                    return await func(this.props.auth.access, ...args)
                } else {
                    throw err
                }
                    
            }
        }
    }

    populateStateIfNecessary = () => {
        const { needToFetchData } = this.state;
        if (
            this.props.isAuthenticated && needToFetchData
        ) {
            this.setState({needToFetchData: false});
            this.actRefreshingTokenIfNecessary(populateState)()
                .then(data => {
                    if (data !== null) {
                        this.setState(data)
                    }
                });
        }
    }

    onLogin = async (username, password) => {
        await this.props.authenticate(username, password);
        if (this.props.auth.error != null) {
            this.setState({
                needToFetchData: true,
            });
            return true;
        }
        return false;
    }

    onLogout = () => {
        this.props.removeAuthTokens();
        this.setState({
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
        this.actRefreshingTokenIfNecessary(createElement)(name)
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
        this.actRefreshingTokenIfNecessary(deleteElement)(item.id)
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
        this.actRefreshingTokenIfNecessary(addTrackEntry)(timeBucket, itemId)
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
        this.actRefreshingTokenIfNecessary(bulkUpdateTrackEntries)(this.props.auth.access, trackEntriesToAdd, trackEntriesToRemove)
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
            isAuthenticated={this.props.isAuthenticated}
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

const mapStateToProps = state => ({
    auth: state.auth,
    isAuthenticated: state.auth.refresh != null,
})

const mapDispatchToProps = dispatch => ({
    storeAuthTokens: (refresh, access) => dispatch(storeAuthTokens(refresh, access)),
    storeRefreshedToken: access => dispatch(storeRefreshedToken(access)),
    showAuthError: error => dispatch(showAuthError(error)),
    removeAuthTokens: () => dispatch(removeAuthTokens()),
    authenticate: (username, password) => dispatch(authenticate(username, password)),
    refreshAccess: refresh => dispatch(refreshAccess(refresh)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)

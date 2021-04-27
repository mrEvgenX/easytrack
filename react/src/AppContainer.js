import React, {
    Component
} from 'react';
import {connect} from 'react-redux';
import {
    populateState, refreshAccess, createNewUser, requestAndStoreCredentials,
    createElement, addTrackEntry, deleteElement, bulkUpdateTrackEntries,
    AccessTokenExpiredError
} from './asyncOperations';
import { UserAlreadyExists, RegistrationFormValidationError, EmailNotVerified } from './exceptions'
import App from './App';
import {storeAuthTokens, storeRefreshedToken, showAuthError, removeAuthTokens} from './redux/auth';


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


class AppContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            needToFetchData: true,
            trackedItems: [],
            trackEntries: [],
        };
    }

    accessRefresher = newAccessToken => {
        this.props.storeRefreshedToken(newAccessToken);
    }

    populateStateIfNecessary = () => {
        const { needToFetchData } = this.state;
        if (
            this.props.auth.isAuthenticated && needToFetchData
        ) {
            this.setState({needToFetchData: false});
            actRefreshingTokenIfNecessary(
                populateState, this.props.auth.refresh, this.accessRefresher
            )(this.props.auth.access)
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
            this.props.storeAuthTokens(loginData.refresh, loginData.access);
            this.setState({
                needToFetchData: true,
            });
            return true;
        } catch (error) {
            this.props.showAuthError(error);
            console.log(error);
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
        actRefreshingTokenIfNecessary(
            createElement, this.props.auth.refresh, this.accessRefresher
        )(this.props.auth.access, name)
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
            deleteElement, this.props.auth.refresh, this.accessRefresher
        )(this.props.auth.access, item.id)
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
            addTrackEntry, this.props.auth.refresh, this.accessRefresher
        )(this.props.auth.access, timeBucket, itemId)
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
            bulkUpdateTrackEntries, this.props.auth.refresh, this.accessRefresher
        )(this.props.auth.access, trackEntriesToAdd, trackEntriesToRemove)
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
            isAuthenticated={this.props.auth.isAuthenticated}
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
    auth: state.auth
})

const mapDispatchToProps = dispatch => ({
    storeAuthTokens: (refresh, access) => dispatch(storeAuthTokens(refresh, access)),
    storeRefreshedToken: access => dispatch(storeRefreshedToken(access)),
    showAuthError: error => dispatch(showAuthError(error)),
    removeAuthTokens: () => dispatch(removeAuthTokens()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)

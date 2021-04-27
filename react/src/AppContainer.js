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
import {storeAuthTokens, storeRefreshedToken, showAuthError, removeAuthTokens, authenticate, refreshAccess} from './redux/auth'
import {populateData, clearData, appendTrackedItem, deleteTrackedItem, addTrackEntries, deleteTrackEntries, noNeedForDataAnymore} from './redux/data'


class AppContainer extends Component {

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
        if (
            this.props.isAuthenticated && this.props.needToFetchData
        ) {
            this.props.noNeedForDataAnymore()
            this.actRefreshingTokenIfNecessary(populateState)()
                .then(data => {
                    if (data !== null) {
                        this.props.populateData(data.trackedItems, data.trackEntries)
                    }
                });
        }
    }

    onLogin = async (username, password) => {
        await this.props.authenticate(username, password)
        if (this.props.auth.error != null) {
            this.props.clearData()
            return true
        }
        return false
    }

    onLogout = () => {
        this.props.removeAuthTokens()
        this.props.clearData()
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
                this.props.appendTrackedItem(data)
            });
    }

    onElementDelete = (item) => {
        this.actRefreshingTokenIfNecessary(deleteElement)(item.id)
            .then(() => {
                this.props.deleteTrackedItem(item)
            });
    }

    onTrackEntryAddition = (itemId) => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const timeBucket = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        this.actRefreshingTokenIfNecessary(addTrackEntry)(timeBucket, itemId)
            .then(data => {
                this.props.addTrackEntries([data])
            });
    }

    applyEntriesChanging = (trackEntriesToAdd, trackEntriesToRemove) => {
        this.actRefreshingTokenIfNecessary(bulkUpdateTrackEntries)(this.props.auth.access, trackEntriesToAdd, trackEntriesToRemove)
            .then(() => {
                this.props.addTrackEntries(trackEntriesToAdd)
                this.props.deleteTrackEntries(trackEntriesToRemove)
            })
    }

    render() {
        return <App
            populateStateIfNecessary={this.populateStateIfNecessary}
            trackedItems={this.props.trackedItems}
            trackEntries={this.props.trackEntries}
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
    trackedItems: state.data.trackedItems,
    trackEntries: state.data.trackEntries,
    needToFetchData: state.data.needToFetchData,
})

const mapDispatchToProps = dispatch => ({
    storeAuthTokens: (refresh, access) => dispatch(storeAuthTokens(refresh, access)),
    storeRefreshedToken: access => dispatch(storeRefreshedToken(access)),
    showAuthError: error => dispatch(showAuthError(error)),
    removeAuthTokens: () => dispatch(removeAuthTokens()),
    authenticate: (username, password) => dispatch(authenticate(username, password)),
    refreshAccess: refresh => dispatch(refreshAccess(refresh)),
    populateData: (trackedItems, trackEntries) => dispatch(populateData(trackedItems, trackEntries)),
    clearData: () => dispatch(clearData()),
    appendTrackedItem: item => dispatch(appendTrackedItem(item)),
    deleteTrackedItem: item => dispatch(deleteTrackedItem(item)),
    addTrackEntries: entries => dispatch(addTrackEntries(entries)),
    deleteTrackEntries: entries => dispatch(deleteTrackEntries(entries)),
    noNeedForDataAnymore: () => dispatch(noNeedForDataAnymore())    
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)

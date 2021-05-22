import React, {
    Component
} from 'react';
import {connect} from 'react-redux';
import App from './App';
import {refreshAccess} from './redux/auth'
import {fetchAndPopulateData, createElement, deleteElement, addTrackEntry, bulkUpdateTrackEntries} from './redux/data'
import {
    obtainTelegramConnectionData, sendTestTelegramMessage, detachTelegramAccount, 
    getNotificationTime, deleteNotificationTime, setNotificationTime
} from './asyncOperations'
import jwtDecode from 'jwt-decode'


class AppContainer extends Component {

    actRefreshingTokenIfNecessary = func => {
        return async (...args) => {
            const { exp } = jwtDecode(this.props.auth.access)
            if (Date.now() >= exp * 1000) {
                await this.props.refreshAccess(this.props.auth.refresh)
            }
            if (this.props.auth.error != null) {
                throw this.props.auth.error
            }
            if (this.props.auth.access == null) {
                throw Error('access token not provided')
            }
            return await func(this.props.auth.access, ...args);
        }
    }

    populateStateIfNecessary = () => {
        this.actRefreshingTokenIfNecessary(this.props.fetchAndPopulateData)()
    }

    onElementCreation = (name) => {
        this.actRefreshingTokenIfNecessary(this.props.createElement)(name)
    }

    onElementDelete = (item) => {
        this.actRefreshingTokenIfNecessary(this.props.deleteElement)(item)
    }

    onTrackEntryAddition = (timeBucket, itemId) => {
        this.actRefreshingTokenIfNecessary(this.props.addTrackEntry)(timeBucket, itemId)
    }

    applyEntriesChanging = (trackEntriesToAdd, trackEntriesToRemove) => {
        this.actRefreshingTokenIfNecessary(this.props.bulkUpdateTrackEntries)(trackEntriesToAdd, trackEntriesToRemove)
    }

    obtainTelegramConnectionData = async () => {
        return await this.actRefreshingTokenIfNecessary(obtainTelegramConnectionData)()
    }

    sendTestTelegramMessage = () => {
        this.actRefreshingTokenIfNecessary(sendTestTelegramMessage)()
    }

    detachTelegramAccount = () => {
        this.actRefreshingTokenIfNecessary(detachTelegramAccount)()
    }

    getNotificationTime = async (itemId) => {
        return await this.actRefreshingTokenIfNecessary(getNotificationTime)(itemId)
    }

    deleteNotificationTime = async (itemId) => {
        return await this.actRefreshingTokenIfNecessary(deleteNotificationTime)(itemId)
    }

    setNotificationTime = async (itemId, notificationTime) => {
        return await this.actRefreshingTokenIfNecessary(setNotificationTime)(itemId, notificationTime)
    }


    render() {
        return <App
            populateStateIfNecessary={this.populateStateIfNecessary}
            onElementCreation={this.onElementCreation}
            onTrackEntryAddition={this.onTrackEntryAddition}
            onElementDelete={this.onElementDelete}
            applyEntriesChanging={this.applyEntriesChanging}
            obtainTelegramConnectionData={this.obtainTelegramConnectionData}
            sendTestTelegramMessage={this.sendTestTelegramMessage}
            detachTelegramAccount={this.detachTelegramAccount}
            getNotificationTime={this.getNotificationTime}
            deleteNotificationTime={this.deleteNotificationTime}
            setNotificationTime={this.setNotificationTime}
            />;
    }

}

const mapStateToProps = state => ({
    auth: state.auth,
})

const mapDispatchToProps = dispatch => ({
    refreshAccess: refresh => dispatch(refreshAccess(refresh)),
    fetchAndPopulateData: (access) => dispatch(fetchAndPopulateData(access)),
    createElement: (access, name) => dispatch(createElement(access, name)),
    deleteElement: (access, item) => dispatch(deleteElement(access, item)),
    addTrackEntry: (access, timeBucket, itemId) => dispatch(addTrackEntry(access, timeBucket, itemId)),
    bulkUpdateTrackEntries: (accessToken, add, remove) => dispatch(bulkUpdateTrackEntries(accessToken, add, remove)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)

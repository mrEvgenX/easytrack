import React, {
    Component
} from 'react';
import {connect} from 'react-redux';
import App from './App';
import {refreshAccess} from './redux/auth'
import {fetchAndPopulateData, createElement, deleteElement, addTrackEntry, bulkUpdateTrackEntries} from './redux/data'
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

    render() {
        return <App
            populateStateIfNecessary={this.populateStateIfNecessary}
            onElementCreation={this.onElementCreation}
            onTrackEntryAddition={this.onTrackEntryAddition}
            onElementDelete={this.onElementDelete}
            applyEntriesChanging={this.applyEntriesChanging}
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

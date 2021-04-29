import React, {
    Component
} from 'react';
import {connect} from 'react-redux';
import {
    addTrackEntry, deleteElement, bulkUpdateTrackEntries,
} from './asyncOperations';
import App from './App';
import {refreshAccess} from './redux/auth'
import {fetchAndPopulateData, createElement, deleteTrackedItem, addTrackEntries, deleteTrackEntries} from './redux/data'
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
        this.actRefreshingTokenIfNecessary(deleteElement)(item.id)
            .then(() => {
                this.props.deleteTrackedItem(item)
            });
    }

    onTrackEntryAddition = (timeBucket, itemId) => {
        this.actRefreshingTokenIfNecessary(addTrackEntry)(timeBucket, itemId)
            .then(data => {
                this.props.addTrackEntries([data])
            });
    }

    applyEntriesChanging = (trackEntriesToAdd, trackEntriesToRemove) => {
        this.actRefreshingTokenIfNecessary(bulkUpdateTrackEntries)(trackEntriesToAdd, trackEntriesToRemove)
            .then(() => {
                this.props.addTrackEntries(trackEntriesToAdd)
                this.props.deleteTrackEntries(trackEntriesToRemove)
            })
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
    deleteTrackedItem: item => dispatch(deleteTrackedItem(item)),
    addTrackEntries: entries => dispatch(addTrackEntries(entries)),
    deleteTrackEntries: entries => dispatch(deleteTrackEntries(entries)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)

import { AccessTokenExpiredError } from '../exceptions';

const baseAPIUrl = '/api/v1/';


// types

// const START_POPULATING_DATA = 'easytrack/data/START_POPULATING_DATA'
const POPULATE_DATA = 'easytrack/data/POPULATE_ITEMS'
const CLEAR_DATA = 'easytrack/data/CLEAR_DATA'
const APPEND_TRACKED_ITEM = 'easytrack/data/APPEND_TRACKED_ITEM'
const DELETE_TRACKED_ITEM = 'easytrack/data/DELETE_TRACKED_ITEM'
const ADD_TRACK_ENTRIES = 'easytrack/data/ADD_TRACK_ENTRIES'
const DELETE_TRACK_ENTRIES = 'easytrack/data/DELETE_TRACK_ENTRIES'

// actions

// const startPopulatingData = () => ({
//     type: START_POPULATING_DATA,
// })

export const populateData = (trackedItems, trackEntries) => ({
    type: POPULATE_DATA,
    payload: {
        trackedItems,
        trackEntries,
    },
})

export const clearData = () => ({
    type: CLEAR_DATA,
})

export const appendTrackedItem = item => ({
    type: APPEND_TRACKED_ITEM,
    payload: item,
})

export const deleteTrackedItem = item => ({
    type: DELETE_TRACKED_ITEM,
    payload: item,
})

export const addTrackEntries = entries => ({
    type: ADD_TRACK_ENTRIES,
    payload: entries,
})

export const deleteTrackEntries = entries => ({
    type: DELETE_TRACK_ENTRIES,
    payload: entries,
})

// operations

export const fetchAndPopulateData = (access) => async dispatch => {
    console.log('fetchAndPopulateData')
    try {
        console.log('fetchAndPopulateData')
        const responses = await Promise.all(
            [baseAPIUrl + 'items', baseAPIUrl + 'entries'].map(
                url => fetch(
                    url, 
                    {
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            'Authorization': `Bearer ${access}`
                        }
                    }
                )
            )
        )
        if (responses.some(response => response.status === 401)) {
            throw new AccessTokenExpiredError()
        } else if (responses.some(response => !response.ok)) {
            throw new Error('Something went wrong')
        }
        const [trackedItems, trackEntries] = await Promise.all(responses.map(response => response.json()))
        dispatch(populateData(trackedItems, trackEntries))
    } catch (error) {
        //
    }
}

export const createElement = (access, name) => async dispatch => {
    try {
        const response = await fetch(
            baseAPIUrl + 'items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({ name })
        })
        if (response.status === 401) {
            throw new AccessTokenExpiredError();
        }
        const data = await response.json()
        if (!response.ok) {
            throw new Error(response.status + ': ' + JSON.stringify(data));
        }
        dispatch(appendTrackedItem(data))
    } catch (error) {
        //
    }
}

export const deleteElement = (access, item) => async dispatch => {
    const response = await fetch(
        baseAPIUrl + 'items/' + item.id,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${access}`
            },
        }
    );
    if (response.status === 401) {
        throw new AccessTokenExpiredError();
    }
    if (!response.ok) {
        const error = await response.json();
        throw new Error(response.status + ': ' + JSON.stringify(error));
    }
    dispatch(deleteTrackedItem(item))
}

// reducers

const initialState = {
    trackedItems: [],
    trackEntries: [],
}

export const dataReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch(type) {
        // case START_POPULATING_DATA:
        //     return {
        //         ...state,
        //         loading: true,
        //     }
        case POPULATE_DATA:
            return {
                ...state,
                trackedItems: payload.trackedItems,
                trackEntries: payload.trackEntries,
            }
        case CLEAR_DATA:
            return {
                ...state,
                trackedItems: [],
                trackEntries: [],
            }
        case APPEND_TRACKED_ITEM:
            return {
                ...state,
                trackedItems: [...state.trackedItems, payload],
            }
        case DELETE_TRACKED_ITEM:
            const trackedItems = [...state.trackedItems]
            const itemPos = trackedItems.indexOf(payload)
            trackedItems.splice(itemPos, 1)
            return {
                ...state,
                trackedItems,
            }
        case ADD_TRACK_ENTRIES:
            const trackEntriesWithAdded = [...state.trackEntries]
            payload.forEach(({item, timeBucket}) => {
                const entryPos = trackEntriesWithAdded.findIndex(
                    ({item: currentItem, timeBucket: currentTimeBucket}) => {
                    return currentItem === item && currentTimeBucket === timeBucket;
                });
                if (entryPos === -1) {
                    trackEntriesWithAdded.push({timeBucket, item});
                }
            });
            return {
                ...state,
                trackEntries: trackEntriesWithAdded,
            }
        case DELETE_TRACK_ENTRIES:
            const trackEntriesWithoutDeleted = [...state.trackEntries]
            payload.forEach(({item, timeBucket}) => {
                const entryPos = trackEntriesWithoutDeleted.findIndex(
                    ({item: currentItem, timeBucket: currentTimeBucket}) => {
                    return currentItem === item && currentTimeBucket === timeBucket;
                });
                if (entryPos !== -1) {
                    trackEntriesWithoutDeleted.splice(entryPos, 1);
                }
            });
            return {
                ...state,
                trackEntries: trackEntriesWithoutDeleted,
            }
        default:
            return state
    }
}

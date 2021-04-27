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

// ...

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

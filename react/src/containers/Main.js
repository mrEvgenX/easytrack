import React from 'react'
import { Redirect } from 'react-router-dom'
import {useSelector} from 'react-redux'
import itemSettingsPopup from '../components/ItemSettingsPopup'
import Item from '../components/Item'
import ItemsList from '../components/ItemsList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'


const Main = props => {
    const {
        onElementCreation,
        onTrackEntryAddition,
        onElementDelete
    } = props;
    const trackedItems = useSelector(state => state.data.trackedItems)
    const trackEntries = useSelector(state => state.data.trackEntries)
    const isAuthenticated = useSelector(state => state.auth.refresh != null)
  
    if (!isAuthenticated) {
        return <Redirect to="/welcome" />;
    }
    
    let itemsToBeDisplayed = trackedItems;
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const todayTimeBucket = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    itemsToBeDisplayed.forEach(item => {
        const checkedToday = trackEntries.filter(entry => entry.item === item.id && entry.timeBucket === todayTimeBucket);
        item.checkedToday = checkedToday.length === 1;
    })
    return (<>
        <div className="container">
            {itemsToBeDisplayed.length > 0 ? 
            <p className="content">Нажмите на соответствующий элемент, чтобы отметить его как "сделанный", не забудьте вернуться к нему завтра</p>
            :
            <p className="content">Придумайте имя для нового элемента и нажмите <FontAwesomeIcon icon={faPlusCircle} />, чтобы начать его отслеживать</p>
            }
        </div>
        <ItemsList onElementCreation={onElementCreation}>
            {itemsToBeDisplayed.map(item =>
                <Item key={item.id} item={item} onTrack={onTrackEntryAddition} onDelete={onElementDelete} checkedToday={item.checkedToday}>
                    {itemSettingsPopup(item)}
                </Item>
            )}
        </ItemsList>
    </>)
}

export default Main

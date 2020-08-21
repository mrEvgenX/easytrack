import React, { useEffect } from 'react';
import itemSettingsPopup from './ItemSettingsPopup';
import Item from './Item';
import ItemsList from './ItemsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';


export default function Main(props) {
    const { 
        populateStateIfNecessary,
        trackedItems, trackEntries,
        onElementCreation,
        onTrackEntryAddition,
        onElementDelete
    } = props;
    useEffect(() => {
        populateStateIfNecessary();
    });
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
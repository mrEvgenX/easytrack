import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import { StatTable, StatTableHeader, StatTableHeaderCell, StatTableRow, StatTableRowCell } from '../components/StatTable';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


// TODO надо унаследовать свойства ItemsList
class ItemsListStat extends Component {

    constructor(props) {
        super(props);
        let fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 20);
        fromDate.setHours(0);
        fromDate.setMinutes(0);
        let toDate = new Date();
        toDate.setDate(toDate.getDate());
        fromDate.setHours(0);
        fromDate.setMinutes(0);
        fromDate.setSeconds(1);
        this.state = {
            newElementName: '',
            trackEntriesToAdd: [],
            trackEntriesToRemove: [],
            editingMode: false,
            fromDate,
            toDate
        };
    }

    componentDidMount() {
        this.props.populateStateIfNecessary();
    }

    handleFromDateChange = date => {
        this.setState({
            fromDate: date
        });
    };

    handleToDateChange = date => {
        this.setState({
            toDate: date
        });
    };

    /* weekdayNumberToWord = weekday_num => {
        return {
            0: 'Вс',
            1: 'Пн',
            2: 'Вт',
            3: 'Ср',
            4: 'Чт',
            5: 'Пт',
            6: 'Сб',
        }[weekday_num]
    } */

    *iterateDaysBetweenDates() {
        let current = new Date(this.state.toDate.getTime());
        while (current >= this.state.fromDate) {
            const month = current.getMonth() < 9 ? `0${current.getMonth() + 1}` : `${current.getMonth() + 1}`;
            const day = current.getDate() < 10 ? `0${current.getDate()}` : `${current.getDate()}`;
            yield `${current.getFullYear()}-${month}-${day}`;
            /* const weekday = this.weekdayNumberToWord(current.getDay());
            yield `${weekday} / ${day}`; */
            current.setDate(current.getDate() - 1);
        }
    }

    hangleEditingModeChange = _ => {
        this.setState(prevState => {
            prevState.editingMode = !prevState.editingMode;
            if (!prevState.editingMode) {
                this.props.applyEntriesChanging(this.state.trackEntriesToAdd, this.state.trackEntriesToRemove);
                prevState.trackEntriesToAdd = [];
                prevState.trackEntriesToRemove = [];
            }
            return prevState;
        })
    }

    addEntriesToAdditionDraft = (itemId, timeBucket) => {
        this.setState(prevState => {
            const entryPos = prevState.trackEntriesToAdd.findIndex(
                ({item: currentItem, timeBucket: currentTimeBucket}) => {
                return currentItem === itemId && currentTimeBucket === timeBucket;
            });
            if (entryPos === -1) {
                prevState.trackEntriesToAdd.push({ item: itemId, timeBucket });
            } else {
                prevState.trackEntriesToAdd.splice(entryPos, 1);
            }
            return prevState;
        })
    }

    addEntriesToDeletionDraft = (itemId, timeBucket) => {
        this.setState(prevState => {
            const entryPos = prevState.trackEntriesToRemove.findIndex(
                ({item: currentItem, timeBucket: currentTimeBucket}) => {
                return currentItem === itemId && currentTimeBucket === timeBucket;
            });
            if (entryPos === -1) {
                prevState.trackEntriesToRemove.push({ item: itemId, timeBucket });
            } else {
                prevState.trackEntriesToRemove.splice(entryPos, 1);
            }
            return prevState;
        })
    }

    render() {
        const { trackedItems, trackEntries, isAuthenticated } = this.props;
        
        if (!isAuthenticated) {
            return <Redirect to="/welcome" />;
        }

        const dates = [...this.iterateDaysBetweenDates()];
        let content = new Map()
        trackedItems.forEach(({ id, name }) => {
            content.set(id, {
                name: name,
                checks: new Set(),
                adds: new Set(),
                removes: new Set(),
            });
        });

        trackEntries.forEach(({ timeBucket, item }) => {
            if (content.has(item)) {
                content.get(item).checks.add(timeBucket);
            }
        });
        this.state.trackEntriesToAdd.forEach(({ timeBucket, item }) => {
            if (content.has(item)) {
                content.get(item).adds.add(timeBucket);
            }
        });
        this.state.trackEntriesToRemove.forEach(({ timeBucket, item }) => {
            if (content.has(item)) {
                content.get(item).removes.add(timeBucket);
            }
        });

        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const todayTimeBucket = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

        let statRableRows = [];
        for (let item of content.entries()) {
            let [itemId, { name, checks, adds, removes }] = item;
            const checkItems = dates.map(date => {
                return { date: date, checked: checks.has(date), added: adds.has(date), removed: removes.has(date) }
            });
            statRableRows.push(
                <StatTableRow key={itemId} itemName={name}>
                    {checkItems.map(checkItem =>
                        <StatTableRowCell key={checkItem.date + '_' + itemId}
                            itemId={itemId}
                            itemName={name}
                            checkItem={checkItem}
                            highlight={checkItem.date === todayTimeBucket}
                            editingMode={this.state.editingMode}
                            addEntriesToAdditionDraft={this.addEntriesToAdditionDraft}
                            addEntriesToDeletionDraft={this.addEntriesToDeletionDraft} />)}
                </StatTableRow>
            );
        }
        return (
            <>
                <div className="container" style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                    С <DatePicker className="input" selected={this.state.fromDate} onChange={this.handleFromDateChange} />
                    по <DatePicker className="input" selected={this.state.toDate} onChange={this.handleToDateChange} />
                </div>
                <div className="container" style={{marginBottom: '10px'}}>
                    <button className="button" onClick={this.hangleEditingModeChange}>
                        {this.state.editingMode ? "Сохранить изменения" : "Перейти в режим редактирования"}
                    </button>
                </div>
                <div className="container" style={{marginBottom: '10px'}}>
                    <p>{this.state.editingMode ? "Щелкайте левой кнопкой по окружностям а потом нажмите сохранить изменения" : null}</p>
                </div>
                <StatTable>
                    <StatTableHeader dates={dates}>
                        {dates.map(item => <StatTableHeaderCell key={item} date={item} highlight={item === todayTimeBucket} />)}
                    </StatTableHeader>
                    {statRableRows}
                </StatTable>
            </>
        );
    }
}


const mapStateToProps = state => ({
    trackedItems: state.data.trackedItems,
    trackEntries: state.data.trackEntries,
    isAuthenticated: state.auth.refresh != null,
})


export default connect(mapStateToProps)(ItemsListStat)

import React, { Component } from 'react';
import { StatTable, StatTableHeader, StatTableHeaderCell, StatTableRow, StatTableRowCell } from './StatTable';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


// TODO надо унаследовать свойства ItemsList
export default class ItemsListStat extends Component {

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
            editingMode: false,
            fromDate,
            toDate
        };
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

    *iterateDaysBetweenDates() {
        let current = new Date(this.state.fromDate.getTime());
        while (current <= this.state.toDate) {
            const month = current.getMonth() < 9 ? `0${current.getMonth() + 1}` : `${current.getMonth() + 1}`;
            const day = current.getDate() < 10 ? `0${current.getDate()}` : `${current.getDate()}`;
            yield `${current.getFullYear()}-${month}-${day}`;
            current.setDate(current.getDate() + 1);
        }
    }

    hangleEditingModeChange = _ => {
        this.setState(prevState => {
            prevState.editingMode = !prevState.editingMode;
            return prevState;
        })
    }

    render() {
        const { trackedItems, trackEntries } = this.props;
        const dates = [...this.iterateDaysBetweenDates()];
        let content = new Map()
        trackedItems.forEach(({ id, name }) => {
            content.set(id, {
                name: name,
                checks: new Set()
            });
        });
        trackEntries.forEach(({ timeBucket, item }) => {
            if (content.has(item)) {
                content.get(item).checks.add(timeBucket);
            }
        })

        let statRableRows = [];
        for (let item of content.entries()) {
            let [itemId, { name, checks }] = item;
            const checkItems= dates.map(date => { return { date: date, checked: checks.has(date) } })
            statRableRows.push(
                <StatTableRow key={itemId} itemName={name}>
                        {checkItems.map(checkItem => 
                            <StatTableRowCell key={checkItem.date + '_' + itemId} 
                                itemId={itemId} 
                                itemName={name}
                                checkItem={checkItem}
                                editingMode={this.state.editingMode} />)}
                </StatTableRow>
            )
        }

        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const todayTimeBucket = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

        return (
            <>
                <div>
                    С <DatePicker selected={this.state.fromDate} onChange={this.handleFromDateChange} />
                    по <DatePicker selected={this.state.toDate} onChange={this.handleToDateChange} />
                </div>
                <div>
                    <button onClick={this.hangleEditingModeChange}>
                        {this.state.editingMode ? "Сохранить изменения" : "Перейти в режим редактирования"}
                    </button>
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

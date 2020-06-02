import React, { Component } from 'react';
import StatTable from './StatTable';
import StatTableRow from './StatTableRow';
import StatTableHeader from './StatTableHeader';
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
        while(current <= this.state.toDate) {
            const month = current.getMonth() < 9 ? `0${current.getMonth() + 1}`: `${current.getMonth() + 1}`;
            const day = current.getDate() < 10 ? `0${current.getDate()}`: `${current.getDate()}`;
            yield `${current.getFullYear()}-${month}-${day}`;
            current.setDate(current.getDate() + 1);
        }
    }

    render() {
        const {trackedItems, trackEntries} = this.props;
        const dates = [...this.iterateDaysBetweenDates()];
        let content = new Map()
        trackedItems.forEach(({id, name}) => {
            content.set(id, {
                name: name,
                checks: new Set()
            });
        });
        trackEntries.forEach(({timeBucket, item}) => {
            if (content.has(item)) {
                content.get(item).checks.add(timeBucket);
            }
        })

        let contentJSX = [];
        for (let item of content.entries()) {
            let [itemId, {name, checks}] = item;
            contentJSX.push(<StatTableRow key={itemId} name={name} checks={ dates.map(date => { return { date: date, checked: checks.has(date) } })} />)
        }

        return (
            <>
                <div>
                    С <DatePicker selected={this.state.fromDate} onChange={this.handleFromDateChange} /> 
                    по <DatePicker selected={this.state.toDate} onChange={this.handleToDateChange} />
                </div>
                <StatTable>
                    <StatTableHeader dates={dates} />
                    {contentJSX}
                </StatTable>
            </>
        );
    }
}

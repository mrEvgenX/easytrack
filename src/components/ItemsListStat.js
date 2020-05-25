import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

    handleClick = (e) => {
        const {createElement, match: {params: {folderSlug}}} = this.props;
        e.preventDefault();
        if (this.state.newElementName !== '') {
            createElement(this.state.newElementName, folderSlug);
            this.setState({newElementName: ''});
        }
    }    

    handleNewElementNameInputChange = (e) => {
        this.setState({newElementName: e.target.value});
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
        const {folders, trackedItems, trackEntries, match: {params: {folderSlug}}} = this.props;
        let currentFolder = undefined;
        for (let folder of folders) {
            if (folder.slug === folderSlug) {
                currentFolder = folder;
                break;
            }
        }
        const dates = [...this.iterateDaysBetweenDates()];
        const itemsInCurrentFolder = trackedItems.filter(item => item.folder === folderSlug);
        let content = new Map()
        itemsInCurrentFolder.forEach(({id, name}) => {
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
                <h3>Статистика по элементам папки "{currentFolder.name}"</h3>
                <p><Link to={'/folder/' + folderSlug}>Назад</Link></p>
                <input type="text" value={this.state.newElementName} onChange={this.handleNewElementNameInputChange} />
                <button onClick={this.handleClick}>Создать элемент</button>
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

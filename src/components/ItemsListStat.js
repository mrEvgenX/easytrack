import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StatTable from './StatTable';
import StatTableRow from './StatTableRow';
import StatTableHeader from './StatTableHeader';


// TODO надо унаследовать свойства ItemsList
export default class ItemsListStat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newElementName: '',
            fromDate: null,
            toDate: null
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

    handleChange = (e) => {
        this.setState({newElementName: e.target.value});
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
        const dates = ['2020-05-01', '2020-05-02', '2020-05-03', '2020-05-04', '2020-05-05'];
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
                <input type="text" value={this.state.newElementName} onChange={this.handleChange} />
                <button onClick={this.handleClick}>Создать элемент</button>
                <StatTable>
                    <StatTableHeader dates={dates} />
                    {contentJSX}
                </StatTable>
            </>
        );
    }
}

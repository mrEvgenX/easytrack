import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class ItemsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newElementName: ''
        };
    }

    handleElementCreation = (e) => {
        const {createElement, match: {params: {folderSlug}}} = this.props;
        e.preventDefault();
        if (this.state.newElementName !== '') {
            createElement(this.state.newElementName, folderSlug);
            this.setState({newElementName: ''});
        }
    }    

    handleElementTracking = (e) => {
        const { addTrackEntry } = this.props;
        e.preventDefault();
        addTrackEntry(e.target.dataset.itemId)
    }

    handleChange = (e) => {
        this.setState({newElementName: e.target.value});
    }

    render() {
        const {folders, trackedItems, match: {params: {folderSlug}}} = this.props;
        let currentFolder = undefined;
        for (let folder of folders) {
            if (folder.slug === folderSlug) {
                currentFolder = folder;
                break;
            }
        }
        const itemsInCurrentFolder = trackedItems.filter(item => item.folder === folderSlug);
        return (
            <>
                <h3>Элементы папки "{currentFolder.name}"</h3>
                <p><Link to={'/folder/' + folderSlug + '/statistics'}>Отчет</Link></p>
                <input type="text" value={this.state.newElementName} onChange={this.handleChange} />
                <button onClick={this.handleElementCreation}>Создать элемент</button>
                <ul>
                    { itemsInCurrentFolder.map( item => <li key={ item.id }>{ item.name } <button data-item-id={item.id} onClick={this.handleElementTracking}>Засчитать</button></li>) }
                </ul>
            </>
        );
    }
}

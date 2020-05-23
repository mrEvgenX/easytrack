import React, { Component } from 'react';


export default class ItemsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newElementName: ''
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
                <input type="text" value={this.state.newElementName} onChange={this.handleChange} />
                <button onClick={this.handleClick}>Создать элемент</button>
                <ul>
                    { itemsInCurrentFolder.map( item => <li key={ item.id }>{ item.name }</li>) }
                </ul>
            </>
        );
    }
}

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
        const {createElement} = this.props;
        e.preventDefault();
        if (this.state.newElementName !== '') {
            createElement(this.state.newElementName, null);
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
        const {trackedItems} = this.props;
        return (
            <>
                <ul>
                    { trackedItems.map( item => <li key={ item.id }>{ item.name } <button data-item-id={item.id} onClick={this.handleElementTracking}>Засчитать</button></li>) }
                    <li>
                        <input type="text" value={this.state.newElementName} onChange={this.handleChange} />
                        <button onClick={this.handleElementCreation}>Создать элемент</button>
                    </li>
                </ul>
            </>
        );
    }
}

import React, { Component } from 'react';
import './ItemsList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';


export default class ItemsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newElementName: ''
        };
    }

    doElementCreation = () => {
        if (this.state.newElementName !== '') {
            this.props.createElement(this.state.newElementName, null);
            this.setState({ newElementName: '' });
        }
    }

    handleElementCreation = (e) => {
        e.preventDefault();
        this.doElementCreation()
    }

    handleKeyDown = e => {
        if (e.key === 'Enter') {
            this.doElementCreation();
        }
    }

    handleChange = (e) => {
        this.setState({ newElementName: e.target.value });
    }

    render() {
        const { children } = this.props;
        return (<ul className="ItemsList">
            {children}
            <li className="Item">
                <input className="FormInput" type="text" value={this.state.newElementName} placeholder="Имя нового элемента" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
                <button onClick={this.handleElementCreation}><FontAwesomeIcon icon={faPlusCircle} /></button>
            </li>
        </ul>);
    }
}

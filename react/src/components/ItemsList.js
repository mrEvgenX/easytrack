import React, { Component } from 'react';
import './Item.css';
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
        return (<section className="section">
            <div className="container">
                <div className="tile is-ancestor">
                    <div className="tile is-parent" style={{flexWrap: "wrap", justifyContent: "space-start"}}>
                        {children}
                        <div className="tile content Item">
                            <input className="FormInput" type="text" value={this.state.newElementName} placeholder="Имя нового элемента" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
                            <button className="button" onClick={this.handleElementCreation}><FontAwesomeIcon icon={faPlusCircle} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>);
    }
}

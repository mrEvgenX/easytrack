import React, { Component } from 'react';


export default class ItemsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newElementName: ''
        };
    }

    handleElementCreation = (e) => {
        const { createElement } = this.props;
        e.preventDefault();
        if (this.state.newElementName !== '') {
            createElement(this.state.newElementName, null);
            this.setState({ newElementName: '' });
        }
    }

    handleChange = (e) => {
        this.setState({ newElementName: e.target.value });
    }

    render() {
        const { children } = this.props;
        return (
            <>
                <ul>
                    {children}
                    <li>
                        <input type="text" value={this.state.newElementName} onChange={this.handleChange} />
                        <button onClick={this.handleElementCreation}>Создать элемент</button>
                    </li>
                </ul>
            </>
        );
    }
}

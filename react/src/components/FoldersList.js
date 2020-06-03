import React, { Component } from 'react';


export default class FoldersList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newFolderName: ''
        };
    }

    handleClick = (e) => {
        const { createFolder } = this.props;
        e.preventDefault();
        if (this.state.newFolderName !== '') {
            createFolder(this.state.newFolderName);
            this.setState({newFolderName: ''});
        }
    }

    handleChange = (e) => {
        this.setState({newFolderName: e.target.value});
    }

    render() {
        const { children } = this.props;
        return (
            <ul>
                {children}
                <li>
                    <input type="text" value={this.state.newFolderName} onChange={this.handleChange} />
                    <button onClick={this.handleClick}>Создать папку</button>
                </li>
            </ul>
        );
    }
}

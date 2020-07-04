import React, { Component } from 'react';
import './FoldersList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';


export default class FoldersList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newFolderName: ''
        };
    }

    doFolderCreation = () => {
        if (this.state.newFolderName !== '') {
            this.props.createFolder(this.state.newFolderName);
            this.setState({newFolderName: ''});
        }        
    }

    handleClick = (e) => {
        e.preventDefault();
        this.doFolderCreation()
    }

    handleChange = (e) => {
        this.setState({newFolderName: e.target.value});
    }

    handleKeyDown = e => {
        if (e.key === 'Enter') {
            this.doFolderCreation();
        }
    }

    render() {
        const { children } = this.props;
        return (<section className="section">
        <div className="container">
            <ul className="FoldersList">
                <p className="content">Фильтр:</p>
                {children}
                <li>
                    <input className="FormInput" type="text" value={this.state.newFolderName} placeholder="Имя новой папки" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
                    <button className="button" onClick={this.handleClick}><FontAwesomeIcon icon={faPlusCircle} /></button>
                </li>
            </ul>
        </div></section>);
    }
}

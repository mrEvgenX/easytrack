import React, { Component } from 'react';
import { Link } from 'react-router-dom';


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
        const { folders } = this.props;
        return (
            <>
                <h3>Папки</h3>
                <input type="text" value={this.state.newFolderName} onChange={this.handleChange} />
                <button onClick={this.handleClick}>Создать папку</button>
                <ul>
                    { folders.map( item => <li key={ item.slug }><Link to={ '/folder/' + item.slug }>{ item.name }</Link></li>) }
                </ul>
            </>
        );
    }
}

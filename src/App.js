import React, { Component } from 'react';
import slug from 'slug';
import './App.css';
import HeaderBlock from './components/HeaderBlock';
import Main from './components/Main';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      folders: [
        {
          user: 0,
          slug: 'odezhda',
          name: 'Одежда'
        }, {
          user: 0,
          slug: 'nabor-privychek',
          name: 'Набор привычек'
        }
      ],
      trackedItems: [
        {
          id: 0,
          folder: 'odezhda',
          name: 'Майка'
        }, {
          id: 1,
          folder: 'odezhda',
          name: 'Джинсы'
        }, {
          id: 2,
          folder: 'nabor-privychek',
          name: 'Медитировать по утрам'
        }, {
          id: 3,
          folder: 'nabor-privychek',
          name: 'Не жаловаться на жизнь'
        }
      ],
      createFolder: this.createFolder,
      createElement: this.createElement
    };
  }

  createFolder = (name) => {
    this.setState({folders: [
      {
        user: 0,
        slug: slug(name),
        name: name
      },
      ...this.state.folders
    ]});
  }

  createElement = (name, folder) => {
    let nextId = 0;
    this.state.trackedItems.forEach(item => {
      if (item.id > nextId) {
        nextId = item.id;
      }
    })
    nextId++;
    this.setState({trackedItems: [
      {
        id: nextId,
        folder: folder,
        name: name
      },
      ...this.state.trackedItems
    ]});
  }

  render() {
    return (
      <div className="App">
        <HeaderBlock />
        <Main globalState={this.state} />
      </div>
    ); 
  }

}

export default App;

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
          name: 'Есть фрукты и овощи'
        }
      ],
      trackEntries: [
        {timeBucket: '2020-05-02', item: 2},
        {timeBucket: '2020-05-04', item: 3},
        {timeBucket: '2020-05-05', item: 2},
        {timeBucket: '2020-05-01', item: 2}
      ],
      createFolder: this.createFolder,
      createElement: this.createElement,
      addTrackEntry: this.addTrackEntry
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

  addTrackEntry = (itemId) => {
    const now = new Date()
    const month = now.getMonth()+1
    const timeBucket = `${now.getFullYear()}-${month < 10? '0' + month : month}-${now.getDate()}`
    this.setState({trackEntries: [
      {
        timeBucket: timeBucket, 
        item: itemId
      },
      ...this.state.trackEntries
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

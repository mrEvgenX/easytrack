import React, { Component } from 'react';
import './App.css';
import HeaderBlock from './components/HeaderBlock';
import Main from './components/Main';


function populateState(accessToken) {
  return new Promise((resolve, _) => {
    Promise.all([
      'http://localhost:8000/api/v1/folders',
      'http://localhost:8000/api/v1/items',
      'http://localhost:8000/api/v1/entries'
    ].map(url => fetch(
      url,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )))
      .then(responses => {
        Promise.all(responses.map(response => response.json()))
          .then(data => {
            console.log(accessToken);
            console.log(data)
            resolve({
              folders: data[0],
              trackedItems: data[1],
              trackEntries: data[2]
            });
          });
      });
  });
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // TODO store it to local storage
      auth: {
        refresh: undefined,
        access: undefined,
      },
      folders: [],
      trackedItems: [],
      trackEntries: [],
      createFolder: this.createFolder,
      createElement: this.createElement,
      addTrackEntry: this.addTrackEntry,
      authenticate: this.authenticate
    };
    fetch(
      'http://localhost:8000/api/v1/auth/token/refresh/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ refresh: this.state.auth.refresh })
      }
    )
      .then(response => {
        if (!response.ok)
          throw new Error(response.status);
        return response;
      })
      .then(response => response.json())
      .catch(error => {
        console.log('error', error);
      })
      .then(data => {
        console.log(data)
        this.setState({ auth: { ...this.state.auth, access: data['access'] } });
        populateState(this.state.auth.access).then(data => { this.setState(data) });
      })
      .catch(error => {
        console.log(error);
      })
  }

  authenticate = (username, password) => {
    fetch(
      'http://localhost:8000/api/v1/auth/token/obtain/', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({username, password})
      })
      .then(response => {
        if (!response.ok)
          throw new Error(response.status);
        return response;
      })
      .then(response => response.json())
      .then(data => {
        this.setState({
          auth: { ...data } 
        });
        populateState(this.state.auth.access).then(data => { this.setState(data) });
      })
      .catch(error => {
        console.log(error);
      });
  }

  createFolder = (name) => {
    fetch(
      'http://localhost:8000/api/v1/folders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${this.state.auth.access}`
        },
        body: JSON.stringify({ name })
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ folders: [...this.state.folders, data] })
      });
  }

  createElement = (name, folder) => {
    fetch(
      'http://localhost:8000/api/v1/items',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${this.state.auth.access}`
        },
        body: JSON.stringify({ folder, name })
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ trackedItems: [...this.state.trackedItems, data] })
      });
  }

  addTrackEntry = (itemId) => {
    const now = new Date()
    const month = now.getMonth() + 1
    const timeBucket = `${now.getFullYear()}-${month < 10 ? '0' + month : month}-${now.getDate()}`
    fetch(
      'http://localhost:8000/api/v1/entries',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${this.state.auth.access}`
        },
        body: JSON.stringify({ timeBucket, item: itemId })
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ trackEntries: [...this.state.trackEntries, data] })
      })
      .catch(error => {
        console.log(error);
      });
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

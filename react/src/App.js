import React, { Component } from 'react';
import './App.css';
import HeaderBlock from './components/HeaderBlock';
import Main from './components/Main';


function populateState(accessToken) {
  return new Promise((resolve, reject) => {
    if (accessToken === null) {
      reject(new Error('Access token not provided'));
    }
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
        if (responses.some(response => !response.ok)) {
          reject(new Error('Access token expired'));
        }
        return responses;
      })
      .then(responses => {
        Promise.all(responses.map(response => response.json()))
          .then(data => {
            resolve({
              folders: data[0],
              trackedItems: data[1],
              trackEntries: data[2]
            });
          });
      })
  });
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // TODO store it to local storage
      auth: {
        refresh: localStorage.getItem('refreshToken'),
        access: localStorage.getItem('accessToken'),
        isAuthenticated: localStorage.getItem('refreshToken') !== null,
        authenticationAttemptFailed: false,
        registrationFailed: null
      },
      folders: [],
      trackedItems: [],
      trackEntries: [],
      createFolder: this.createFolder,
      createElement: this.createElement,
      addTrackEntry: this.addTrackEntry,
      authenticate: this.authenticate,
      register: this.register
    };
    populateState(this.state.auth.access)
      .then(data => {
        this.setState(data)
      })
      .catch(_ => {
        this.refreshAccess(this.state.auth.refresh)
        .then(data => {
          this.setState({ auth: { ...this.state.auth, access: data.access } });
          populateState(this.state.auth.access).then(data => { this.setState(data) });
        }).catch(error => {
          console.log(error);
        });
      });
  }

  authenticate = (username, password) => {
    fetch(
      'http://localhost:8000/api/v1/auth/token/obtain', 
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
          auth: { ...data, isAuthenticated: true } 
        });
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('accessToken', data.access);
        populateState(this.state.auth.access).then(data => { this.setState(data) });
      })
      .catch(error => {
        this.setState({auth: { ...this.state.auth, authenticationAttemptFailed: true, registrationFailed: null }});
        console.log(error);
      });
  }

  refreshAccess = (refreshToken) => {
    return new Promise((resolve, reject) => {
      fetch(
        'http://localhost:8000/api/v1/auth/token/refresh',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ refresh: refreshToken })
        }
      )
        .then(response => {
          if (!response.ok)
            throw new Error(response.status);
          return response;
        })
        .then(response => response.json())
        .then(data => {
          localStorage.setItem('accessToken', data.access);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  logout = () => {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    this.setState({
      auth: {
        ...this.state.auth,
        refresh: null,
        access: null,
        isAuthenticated: false,
        registrationFailed: null
      },
      folders: [],
      trackedItems: [],
      trackEntries: [],
    });
  }

  register = (login, password) => {
    fetch(
      'http://localhost:8000/api/v1/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ email: login, password })
      }
    )
      .then(response => {
        if (!response.ok)
          throw new Error(response.status);
        return response;
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({auth: { ...this.state.auth, registrationFailed: false }});
      })
      .catch(error => {
        console.log(error);
        this.setState({auth: { ...this.state.auth, registrationFailed: true }});
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
        <HeaderBlock isAuthenticated={this.state.auth.isAuthenticated} logout={this.logout} />
        <Main globalState={this.state} />
      </div>
    );
  }

}

export default App;

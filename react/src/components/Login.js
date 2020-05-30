import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: '',
            password: ''
        }
    }

    handleLoginChange = e => {
        this.setState({login: e.target.value});
    }

    handlePasswordChange = e => {
        this.setState({password: e.target.value});
    }

    handleLoginClick = e => {
        e.preventDefault();
        const { authenticate } = this.props;
        authenticate(this.state.login, this.state.password);
        this.setState({login: '', password: ''});
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <>
                <h2>Вход на сайт</h2>
                <form>
                    <div>
                        <input type='text' name='login' placeholder='E-mail' onChange={this.handleLoginChange} />
                    </div>
                    <div>
                        <input type='password' name='password' placeholder='Пароль' onChange={this.handlePasswordChange} />
                    </div>
                    <div>
                        <input type='submit' value='Войти' onClick={this.handleLoginClick} />
                    </div>
                </form>
            </>
        );
    }
}

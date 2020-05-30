import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: '',
            password: '',
            requiredFieldsNotFilled: false
        }
    }

    handleInputChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    handleLoginClick = e => {
        console.log('HELLO!!!!!');
        e.preventDefault();
        const { authenticate } = this.props;
        if (this.state.login === '' || this.state.password === '') {
            this.setState({ requiredFieldsNotFilled: true });
        } else {
            this.setState({login: '', password: '', requiredFieldsNotFilled: false });
            authenticate(this.state.login, this.state.password);
        }
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
                        <input type='text' name='login' placeholder='E-mail' onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <input type='password' name='password' placeholder='Пароль' onChange={this.handleInputChange} />
                    </div>
                    <div>
                        { this.state.requiredFieldsNotFilled? <p>Все поля обязательны</p>: null }
                        { this.props.authenticationAttemptFailed? <p>Неправильный логин или пароль</p>: null }
                        <input type='submit' value='Войти' onClick={this.handleLoginClick} />
                    </div>
                </form>
            </>
        );
    }
}

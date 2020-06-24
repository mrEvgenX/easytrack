import React, { Component } from 'react';
import './SignInSignUpForm.css';


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
        e.preventDefault();
        const { onLogin } = this.props;
        if (this.state.login === '' || this.state.password === '') {
            this.setState({ requiredFieldsNotFilled: true });
        } else {
            this.setState({requiredFieldsNotFilled: false });
            onLogin(this.state.login, this.state.password);
        }
    }

    render() {
        return (
            <div className="SignInSignUpForm">
                <h2>Вход на сайт</h2>
                <form>
                    <div>
                        <input type='text' name='login' placeholder='E-mail' value={this.state.login} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <input type='password' name='password' placeholder='Пароль' value={this.state.password} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        { this.state.requiredFieldsNotFilled? <p>Все поля обязательны</p>: null }
                        { this.props.authenticationAttemptFailed? <p>Неправильный логин или пароль</p>: null }
                        <input type='submit' value='Войти' onClick={this.handleLoginClick} />
                    </div>
                </form>
            </div>
        );
    }
}

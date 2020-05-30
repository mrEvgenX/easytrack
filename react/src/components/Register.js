import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            passwordRepeat: '',
            requiredFieldsNotFilled: false,
            passwordsMatchFailed: false,
        }
    }

    handleInputChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    handleRegisterClick = e => {
        e.preventDefault();
        const { register } = this.props;
        const { login, password, passwordRepeat } = this.state;
        if (login === '' || password === '' || passwordRepeat === '') {
            this.setState({ requiredFieldsNotFilled: true, passwordsMatchFailed: false  });
        } else {
            if (password !== passwordRepeat) {
                this.setState({ requiredFieldsNotFilled: false, passwordsMatchFailed: true  });
            } else {
                this.setState({ requiredFieldsNotFilled: false, passwordsMatchFailed: false });
                register(login, password);
            }
        }
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />;
        }
        if (this.props.registrationFailed !== null && !this.props.registrationFailed ) {
            return <Redirect to="/login" />;
        }
        return (
            <>
                <h2>Создание нового профиля</h2>
                <form>
                    <div>
                        <input type='text' name='login' placeholder='E-mail' onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <input type='password' name='password' placeholder='Пароль' onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <input type='password' name='passwordRepeat' placeholder='Пароль еще раз' onChange={this.handleInputChange} />
                    </div>
                    <div>
                        { this.state.requiredFieldsNotFilled? <p>Все поля обязательны</p> : null }
                        { this.state.passwordsMatchFailed? <p>Пароли не совпадают</p> : null }
                        { this.props.registrationFailed? <p>Некорректный email, либо такой пользователь уже существует</p> : null }
                        <input type='submit' value='Зарегистрироваться' onClick={this.handleRegisterClick} />
                    </div>
                </form>
            </>
        );
    }
}

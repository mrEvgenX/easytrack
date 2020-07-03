import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './SignInSignUpForm.css';


export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            passwordRepeat: '',
            requiredFieldsNotFilled: false,
            passwordsMatchFailed: false,
            userAlreadyExists: false,
            notValidForm: false,
            registrationUnexpectedlyFailed: false,
            registrationSucceeded: false
        }
    }

    handleInputChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    handleRegisterClick = e => {
        e.preventDefault();
        const { onRegister } = this.props;
        const { login, password, passwordRepeat } = this.state;
        if (login === '' || password === '' || passwordRepeat === '') {
            this.setState({ requiredFieldsNotFilled: true, passwordsMatchFailed: false  });
        } else {
            if (password !== passwordRepeat) {
                this.setState({ requiredFieldsNotFilled: false, passwordsMatchFailed: true  });
            } else {
                this.setState({ requiredFieldsNotFilled: false, passwordsMatchFailed: false });
                onRegister(login, password)
                    .then(data => this.setState({ ...data }))
                    .catch(error => {
                        this.setState({ registrationUnexpectedlyFailed: true });
                        console.log(error);
                    });
            }
        }
    }

    render() {
        const { requiredFieldsNotFilled, passwordsMatchFailed, notValidForm, userAlreadyExists, registrationUnexpectedlyFailed, registrationSucceeded } = this.state;
        if (registrationSucceeded) {
            return <Redirect to="/one-more-step" />;
        }
        return (
            <div className="SignInSignUpForm">
                <h2>Создание нового профиля</h2>
                <form>
                    <div>
                        <input type='email' name='login' placeholder='E-mail' onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <input type='password' name='password' placeholder='Пароль' onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <input type='password' name='passwordRepeat' placeholder='Пароль еще раз' onChange={this.handleInputChange} />
                    </div>
                    <div>
                        { requiredFieldsNotFilled? <p>Все поля обязательны</p> : null }
                        { passwordsMatchFailed? <p>Пароли не совпадают</p> : null }
                        { notValidForm? <p>Некорректный email</p> : null }
                        { userAlreadyExists? <p>Такой пользователь уже существует</p> : null }
                        { registrationUnexpectedlyFailed? <p>Абсолютно неизвестная ошибка:(</p> : null }
                        <input type='submit' value='Зарегистрироваться' onClick={this.handleRegisterClick} />
                    </div>
                </form>
            </div>
        );
    }
}

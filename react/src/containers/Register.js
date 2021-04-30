import React, { Component } from 'react'
import {connect, useSelector} from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createNewUser } from '../asyncOperations'
import { UserAlreadyExists, RegistrationFormValidationError, EmailNotVerified } from '../exceptions'
import './SignInSignUpForm.css'
import Cookies from 'js-cookie'


export const OneMoreStep = () => {
    // TODO надо никогда не пускать на эту страницу, если только что не завершалась регистрация
    const isAuthenticated = useSelector(state => state.auth.refresh != null)
    if (isAuthenticated) {
        return <Redirect to="/" />;
    }
    return <h2>Вам направлено письмо с инструкцией для завершения регистрации.</h2>
}


export const AwaitActivationByAdmin = () => {
    // TODO надо никогда не пускать на эту страницу, если только что не завершалась регистрация
    const isAuthenticated = useSelector(state => state.auth.refresh != null)
    if (isAuthenticated) {
        return <Redirect to="/" />;
    }
    return <h2>Заявка на регистрацию направлена администратору, скоро он примет решение по поводу ее одобрения.</h2>
}


class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            passwordRepeat: '',
            requiredFieldsNotFilled: false,
            passwordsMatchFailed: false,
            userAlreadyExists: false,
            emailNotVerified: false,
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
        const { login, password, passwordRepeat } = this.state;
        if (login === '' || password === '' || passwordRepeat === '') {
            this.setState({ requiredFieldsNotFilled: true, passwordsMatchFailed: false  });
        } else {
            if (password !== passwordRepeat) {
                this.setState({ requiredFieldsNotFilled: false, passwordsMatchFailed: true  });
            } else {
                this.setState({ requiredFieldsNotFilled: false, passwordsMatchFailed: false });
                this.onRegister(login, password)
                    .then(data => this.setState({ ...data }))
                    .catch(error => {
                        this.setState({ registrationUnexpectedlyFailed: true });
                        console.log(error);
                    });
            }
        }
    }

    onRegister = async (login, password) => {
        let result = {
            userAlreadyExists: false,
            emailNotVerified: false,
            notValidForm: false,
            registrationSucceeded: false
        }
        try {
            await createNewUser(login, password, Cookies.get('csrftoken'));
            result.registrationSucceeded = true;
        } catch(error) {
            if (error instanceof RegistrationFormValidationError) {
                result.notValidForm = true;
            } else if (error instanceof UserAlreadyExists) {
                result.userAlreadyExists = true;
            } else if (error instanceof EmailNotVerified) {
                result.registrationSucceeded = true;
                result.emailNotVerified = true;
            } else {
                throw error;
            }
        }
        return result;
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />;
        }
        const { requiredFieldsNotFilled, passwordsMatchFailed, notValidForm, userAlreadyExists, emailNotVerified, registrationUnexpectedlyFailed, registrationSucceeded } = this.state;
        if (registrationSucceeded) {
            if (emailNotVerified) {
                return <Redirect to="/await-activation-by-admin" />;
            }
            return <Redirect to="/one-more-step" />;
        }
        return (
            <>
                <section className="hero is-danger">
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <h1 className="title">Создание нового профиля</h1>
                        </div>
                    </div>
                </section>
                <section className="section">
                    <form className="SignInSignUpForm">
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
                </section>
            </>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.refresh != null,
})

export default connect(mapStateToProps)(Register)

import React from 'react';
import { Link } from 'react-router-dom';


export default function WelcomeBlock() {
    return (<>
        <section className="hero is-success">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">Добро пожаловать</h1>
                    <h2 className="subtitle">С EasyTrack вы можете начать улучшать свою жизнь уже прямо сейчас!</h2>
                </div>
            </div>
        </section>

        <section className="hero is-primary">
            <div className="hero-body">
                <div className="container">
            <h1 className="title">Описывайте желаемые привычки</h1>
            <p className="subtitle">"Чистить зубы 2 раза в день", "Медитировать", "Выходить на пробежку"...</p>
                </div>
            </div>
        </section>

        <section className="hero is-dark">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">Отмечайте свой прогресс</h1>
                    <p className="subtitle">Следуйте намеченному плану и раз в день отмечайте выполнение нужных действий</p>
                </div>
            </div>
        </section>

        <section className="hero is-info">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">Анализируйте</h1>
                    <p className="subtitle">Вам будет доступна статистика за прошедшие дни в наглядном виде</p>
                </div>
            </div>
        </section>

        <section className="hero is-warning">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">Организуйте</h1>
                    <p className="subtitle">Если отслеживаемых элементов становится много, они могут быть 
                    собраны в тематические папки, например: "Личная эффективность", "Гармония в семье"...</p>
                </div>
            </div>
        </section>
        
        <section className="hero is-light">
            <div className="hero-body">
            <div className="container">
            <div className="tile is-ancestor">
                <div className="tile is-parent">
                    <div className="tile content">
                        <Link className="button is-danger is-fullwidth" to='/register'>Создать профиль</Link>
                    </div>
                </div>
                <div className="tile is-parent">
                    <div className="tile content">
                        <Link className="button is-success is-fullwidth" to='/login'>Войти</Link>
                    </div>
                </div>
            </div>
            </div>

            </div>
        </section>
    </>);
}

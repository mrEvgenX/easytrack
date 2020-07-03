import React from 'react';
import { Link } from 'react-router-dom';


export default function WelcomeBlock() {
    return (
        <section className="section">
            <div className="container">
                <h2 className="title">Добро пожаловать</h2>
                <p className="subtitle">С EasyTrack вы можете начать улучшать свою жизнь уже прямо сейчас!</p>
            </div>
            
            <div className="container">
                <h2 className="title">Описывайте желаемые привычки</h2>
                <p className="subtitle">"Чистить зубы 2 раза в день", "Медитировать", "Выходить на пробежку"...</p>
            </div>
            
            <div className="container">
                <h2 className="title">Отмечайте свой прогресс</h2>
                <p className="subtitle">Следуйте намеченному плану и раз в день отмечайте выполнение нужных действий</p>
            </div>
            
            <div className="container">
                <h2 className="title">Анализируйте</h2>
                <p className="subtitle">Вам будет доступна статистика за прошедшие дни в наглядном виде</p>
            </div>
            
            <div className="container">
                <h2 className="title">Организуйте</h2>
                <p className="subtitle">Сами привычки будут собраны в тематические папки, например: "Личная эффективность", "Гармония в семье"...</p>
            </div>

            <div className="container">
                <Link className="button is-primary" to='/register'>Создать профиль</Link>
            </div>
            <div className="container">
                <Link className="button is-primary" to='/login'>Войти</Link>
            </div>
        </section>
    );
}

import React from 'react'


const TelegramDetachConfirmationModal = ({isVisible, toggleVisibility}) => (
    <div className={"modal " + (isVisible? "is-active" : "")}>
        <div className="modal-background" onClick={toggleVisibility}></div>
        <div className="modal-content">
            <div className="box">
                <p>Вы уверены?</p>
                <button className="button is-danger">Да</button>
                <button className="button is-info" onClick={toggleVisibility}>Нет</button>
            </div>
        </div>
        <button className="modal-close is-large" onClick={toggleVisibility} aria-label="close"></button>
    </div>
)


export default TelegramDetachConfirmationModal

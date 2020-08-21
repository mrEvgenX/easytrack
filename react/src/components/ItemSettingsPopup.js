import React, { useState } from 'react';


const ItemSettingsPopup = (props) => {
    const { item, handleDeletion } = props;
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const onDeleteConfirmationTextChanged = e => {
        setDeleteConfirmed(e.target.value.toLowerCase() === 'подтверждаю');
    }
    return (<>
        <h3 className="title">{item.name}</h3>
        <p className="content">Чтобы удалить элемент навсегда, надо написать "Подтверждаю" в поле ниже и тогда кнопка станет активной.</p>
        <div className="container">
            <div className="field">
                <div className="control">
                    <input className="input" type="text" placeholder="Подтверждаю" onChange={onDeleteConfirmationTextChanged} />
                </div>
            </div>
            <button className="button is-danger" onClick={handleDeletion} disabled={!deleteConfirmed}>Удалить элемент</button>
        </div>
    </>)
}


export default (item) => (handleDeletion) => (
    <ItemSettingsPopup item={item} handleDeletion={handleDeletion} />
)

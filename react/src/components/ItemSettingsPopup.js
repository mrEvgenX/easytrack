import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const ItemSettingsPopup = (props) => {
    const {
        item, handleDeletion, telegramConnected, obtainingTelegramConnectionData,
        getNotificationTime, deleteNotificationTime, setNotificationTime
    } = props;
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const [notificationSpecified, setNotificationTimeSpecified] = useState(false);
    const [notificationEnabled, setNotificationEnabled] = useState(false);
    const [notificationTime, setNotificationTimeValue] = useState();

    useEffect(() => {
        getNotificationTime(item.id)
            .then(data => {
                if (data != null) {
                    setNotificationTimeSpecified(true)
                    setNotificationEnabled(true)
                    setNotificationTimeValue(data.notification_time)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }, [item, getNotificationTime])

    const onDeleteConfirmationTextChanged = e => {
        setDeleteConfirmed(e.target.value.toLowerCase() === 'подтверждаю');
    }

    const onNotificationSpecified = (e) => {
        setNotificationTime(item.id, notificationTime)
            .then(() => {
                setNotificationTimeSpecified(true)
                setNotificationEnabled(true)
                setNotificationTimeValue(notificationTime)
            })
            .catch(error => {
                console.log(error)
            })
    }
    const onNotificationDeleted = (e) => {
        deleteNotificationTime(item.id)
            .then(() => {
                setNotificationTimeSpecified(false)
                setNotificationEnabled(false)
                setNotificationTimeValue(null)
            })
            .catch(error => {
                console.log(error)
            })
    }
    
    const uiTelegramStatusLoading = <p className="content">Загрузка</p>
    const uiTelegramNeedToBeConnected = <p className="content">Но прежде всего, надо привязать свой Telegram-аккаунт в <Link to="/settings">настройках</Link></p>

    return (<>
        <h3 className="title">{item.name}</h3>
        <h5 className="title">Уведомления в Telegram</h5>
        {obtainingTelegramConnectionData ? uiTelegramStatusLoading
        :
            !telegramConnected ? uiTelegramNeedToBeConnected
            :
                !notificationSpecified?
                <>
                    <div className="field">
                        <div className="control">
                            <label className="checkbox">
                                <input type="checkbox" checked={notificationEnabled} onChange={(e) => setNotificationEnabled(e.target.checked)} /> Включить уведомления в Telegram
                            </label>
                        </div>  
                    </div>
                    {notificationEnabled? 
                    <div className="field">
                        <div className="control">
                            <input className="input" type="text" placeholder="Время в формате HH:MM:SS в часовом поясе МСК+4" value={notificationTime} onChange={(e) => setNotificationTimeValue(e.target.value)} />
                        </div>
                    </div> : null}
                    <button className="button is-primary" onClick={onNotificationSpecified}>Применить</button>
                </>
                :
                <>
                    <p>Уведомление придет в {notificationTime} (МСК+4)</p>
                    <button className="button is-danger" onClick={onNotificationDeleted}>Удалить</button>
                </>
        }
        <h5 className="title">Удаление</h5>
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


export default (item, telegramConnected, obtainingTelegramConnectionData, getNotificationTime, deleteNotificationTime, setNotificationTime) => (handleDeletion) => (
    <ItemSettingsPopup 
        item={item} handleDeletion={handleDeletion}
        telegramConnected={telegramConnected}
        obtainingTelegramConnectionData={obtainingTelegramConnectionData}
        getNotificationTime={getNotificationTime}
        deleteNotificationTime={deleteNotificationTime}
        setNotificationTime={setNotificationTime}
        />
)

import React, {useState} from 'react'
import TelegramDetachConfirmationModal from './TelegramDetachConfirmationModal'


const TelegramConnection = ({loading, connected, telegramUsername, telegramConnectionLink, sendTestTelegramMessage, detachTelegramAccount}) => {
    const [telegramDetachConfirmationModalVisible, setTelegramDetachConfirmationModalVisible] = useState()
    const [sendingTestMessage, setSengingTestMessage] = useState(false)

    const toggleTelegramDetachConfirmationModal = () => {
        setTelegramDetachConfirmationModalVisible(!telegramDetachConfirmationModalVisible);
    }
    const handleTestMessageSending = () => {
        setSengingTestMessage(true)
        sendTestTelegramMessage()
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setSengingTestMessage(false)
            })
    }

    return (
        <div>
            <h4 className="title is-4">Привязка к telegram</h4>
            {loading? 
                <p>Загрузка...</p>
            :                
                connected ?
                <>
                    <p>
                        Профиль привязан к телеграм-аккаунту @{telegramUsername}. На него можно настроить напоминания о своих целях.
                    </p>
                    <button className="button is-danger" onClick={toggleTelegramDetachConfirmationModal}>Отменить привязку</button>
                    <TelegramDetachConfirmationModal
                        isVisible={telegramDetachConfirmationModalVisible}
                        toggleVisibility={() => {
                            toggleTelegramDetachConfirmationModal()
                                .then(() => {
                                    setTelegramDetachConfirmationModalVisible(false)
                                })
                        }}
                        detachTelegramAccount={detachTelegramAccount}/>
                    <button className="button is-info" onClick={handleTestMessageSending} disabled={sendingTestMessage}>{sendingTestMessage? "Отправляется...": "Послать тестовое сообщение"}</button>
                </>
                :
                <>
                    <p>
                        Привязывать телеграм-аккаунт необходимо, если вы хотите получать напоминания о своих целях.
                    </p>
                    <a href={telegramConnectionLink} target="_blank" rel="noopener noreferrer">Секретная ссылка для привязки телеграм-аккаунта</a>
                </>
            }
        </div>
    )
}


export default TelegramConnection

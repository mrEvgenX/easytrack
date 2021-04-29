import React, { useState, useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { getConfirmationStatus } from '../asyncOperations';


const EmailConfirmation = () => {
    const { userId, token } = useParams()
    const [responseAccepted, setResponseAccepted] = useState(false)
    const [confirmed, setConfirmed] = useState(false)
    useEffect(() => {
        if (!responseAccepted) {
            getConfirmationStatus(userId, token)
                .then(_ => {
                    setConfirmed(true)
                })
                .catch(_ => {
                    setConfirmed(false)
                })
                .finally(_ => {
                    setResponseAccepted(true)
                })
        }
    })
    if (!responseAccepted)
        return <h2>Пожалуйста, подождите...</h2>
    else if (confirmed)
        return <Redirect to="/login" />;
    else
        return <h2>Код активации не подошел:(</h2>
}


export default EmailConfirmation

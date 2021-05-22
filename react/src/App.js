import React, { useEffect } from 'react'
import {
    BrowserRouter,
    Switch,
    Route,
} from 'react-router-dom'
import {useSelector} from 'react-redux'
import './App.css'
import HeaderBlock from './containers/HeaderBlock'
import ItemsListStat from './containers/ItemsListStat'
import Login from './containers/Login'
import Register, {OneMoreStep, AwaitActivationByAdmin} from './containers/Register'
import WelcomeBlock from './components/WelcomeBlock'
import Main from './containers/Main'
import Settings from './containers/Settings'
import EmailConfirmation from './components/EmailConfirmation'
import NotFoundPage from './components/NotFoudPage'


export default function App(props) {
    const {
        populateStateIfNecessary,
        onElementCreation,
        onTrackEntryAddition,
        onElementDelete,
        applyEntriesChanging,
        obtainTelegramConnectionData,
        sendTestTelegramMessage,
        detachTelegramAccount,
        getNotificationTime,
        deleteNotificationTime,
        setNotificationTime
    } = props
    console.log('App', obtainTelegramConnectionData)
    const isAuthenticated = useSelector(state => state.auth.refresh != null)

    useEffect(() => {
        if (isAuthenticated) {
            populateStateIfNecessary()
        }
    }, [populateStateIfNecessary, isAuthenticated]);

    return (
        <BrowserRouter>
            <div className="App" >
                <HeaderBlock />
                <Switch>
                    <Route exact path="/" render={
                        () => <Main
                            onElementCreation={onElementCreation}
                            onTrackEntryAddition={onTrackEntryAddition}
                            onElementDelete={onElementDelete}
                            obtainTelegramConnectionData={obtainTelegramConnectionData}
                            getNotificationTime={getNotificationTime}
                            deleteNotificationTime={deleteNotificationTime}
                            setNotificationTime={setNotificationTime} />
                    } />
                    <Route exact path="/statistics" render={
                        () => <ItemsListStat
                            applyEntriesChanging={applyEntriesChanging} />
                    }
                    />
                    <Route exact path="/settings" render={
                        () => <Settings
                            obtainTelegramConnectionData={obtainTelegramConnectionData}
                            sendTestTelegramMessage={sendTestTelegramMessage}
                            detachTelegramAccount={detachTelegramAccount} />
                    } />
                    <Route exact path="/welcome" component={WelcomeBlock} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/one-more-step"  component={OneMoreStep} />
                    <Route exact path="/await-activation-by-admin" component={AwaitActivationByAdmin} />
                    <Route path="/confirm/:userId/:token" component={EmailConfirmation} />
                    <Route component={NotFoundPage} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/store'
import { NotificationProvider, GlobalNotification } from './components/ui/NotificationProvider'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NotificationProvider>
                    <GlobalNotification />
                    <App />
                </NotificationProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
)


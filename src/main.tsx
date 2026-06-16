import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerServiceWorker } from './lib/reminder-notifications'
import { registerCapacitorNotificationRouting } from './lib/reminder-notifications-native'

void registerServiceWorker();
registerCapacitorNotificationRouting();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

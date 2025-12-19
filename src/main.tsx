import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { enableMocks } from './mocks'

// Initialize mocks before rendering
enableMocks()
  .then(() => {
    console.log('🟢 Mocks enabled, rendering app...')
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  })
  .catch((error) => {
    console.error('🔴 Failed to enable mocks:', error)
  })

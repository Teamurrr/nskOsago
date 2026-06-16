import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./shared/mocks')

    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
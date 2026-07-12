import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App'
import { ErrorBoundary } from './app/providers/error-boundary'

async function enableMocking() {
  const shouldEnableMocks =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS !== 'false'

  if (shouldEnableMocks) {
    const { worker } = await import('./shared/mocks')

    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
</StrictMode>
  )
})

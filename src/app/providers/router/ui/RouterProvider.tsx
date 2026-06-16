import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from '../../../routes/ui/AppRouter'

export function RouterProvider() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

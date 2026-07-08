import { Route, Routes } from 'react-router-dom'

import { CalculatorPage } from '../../../pages/calculator'
import { NotFoundPage } from '../../../pages/not-found'
import { PoliciesListPage } from '../../../pages/policies-list'
import { PolicyCreatePage } from '../../../pages/policy-create'
import { PolicyDetailsPage } from '../../../pages/policy-details'
import { AppLayout } from '../../../widgets/app-layout'
import { routePaths } from '../config/routePaths'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={routePaths.home} element={<PoliciesListPage />} />
        <Route path={routePaths.policies} element={<PoliciesListPage />} />
        <Route path={routePaths.calculator} element={<CalculatorPage />} />
        <Route path={routePaths.policyCreate} element={<PolicyCreatePage />} />
        <Route path={routePaths.policyDetails} element={<PolicyDetailsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

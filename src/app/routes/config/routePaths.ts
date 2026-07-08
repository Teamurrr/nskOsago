export const routePaths = {
  home: '/',
  policies: '/policies',
  calculator: '/calculator',
  policyCreate: '/policies/new',
  policyDetails: '/policies/:id',
  getPolicyDetails: (id: string) => `/policies/${id}`,
} as const
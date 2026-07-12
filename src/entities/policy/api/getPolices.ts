import { apiClient } from '../../../shared/api'
import { getPolicyDrafts } from '../model/draftStorage'
import type { Policy } from '../model/types'

export async function getPolicies() {
  const response = await apiClient.get<unknown>('/policies')

  if (!Array.isArray(response.data)) {
    throw new Error('Invalid policies response')
  }

  return [...getPolicyDrafts(), ...(response.data as Policy[])]
}

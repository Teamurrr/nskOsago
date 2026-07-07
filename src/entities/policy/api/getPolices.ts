import { apiClient } from '../../../shared/api'
import { getPolicyDrafts } from '../model/draftStorage'
import type { Policy } from '../model/types'

export async function getPolicies() {
  const response = await apiClient.get<Policy[]>('/policies')

  return [...getPolicyDrafts(), ...response.data]
}

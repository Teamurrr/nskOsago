import { apiClient } from '../../../shared/api'
import type { Policy } from '../model/types'

export async function getPolicies() {
  const response = await apiClient.get<Policy[]>('/policies')

  return response.data
}
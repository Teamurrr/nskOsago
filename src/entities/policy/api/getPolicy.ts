import { apiClient } from '../../../shared/api'
import type { Policy } from '../model/types'

export async function getPolicy(id: string) {
  const response = await apiClient.get<Policy>(`/policies/${id}`)

  return response.data
}
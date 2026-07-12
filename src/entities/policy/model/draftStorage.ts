import type { Policy } from './types'

const policyDraftsStorageKey = 'nsk.policyDrafts'

function canUseLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPolicyDraft(value: unknown): value is Policy {
  if (!isRecord(value)) {
    return false
  }

  const { vehicle, owner, premium } = value

  return (
    typeof value.id === 'string' &&
    typeof value.number === 'string' &&
    typeof value.status === 'string' &&
    isRecord(vehicle) &&
    typeof vehicle.model === 'string' &&
    typeof vehicle.registrationNumber === 'string' &&
    isRecord(owner) &&
    typeof owner.firstName === 'string' &&
    typeof owner.lastName === 'string' &&
    isRecord(premium) &&
    typeof premium.total === 'number'
  )
}

export function getPolicyDrafts(): Policy[] {
  if (!canUseLocalStorage()) {
    return []
  }

  const rawValue = window.localStorage.getItem(policyDraftsStorageKey)

  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue)

    return Array.isArray(parsedValue) ? parsedValue.filter(isPolicyDraft) : []
  } catch {
    return []
  }
}

export function savePolicyDraft(policy: Policy) {
  if (!canUseLocalStorage()) {
    return
  }

  const drafts = getPolicyDrafts().filter((draft) => draft.id !== policy.id)

  window.localStorage.setItem(policyDraftsStorageKey, JSON.stringify([policy, ...drafts]))
}

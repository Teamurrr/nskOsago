import type { Policy } from './types'

const policyDraftsStorageKey = 'nsk.policyDrafts'

function canUseLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
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

    return Array.isArray(parsedValue) ? parsedValue : []
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

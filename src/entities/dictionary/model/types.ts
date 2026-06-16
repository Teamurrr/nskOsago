export interface Region {
  id: string
  nameRu: string
  nameEn: string
  kt: number
}

export interface PowerTier {
  max: number | null
  k: number
}

export interface InsuranceDuration {
  id: string
  nameRu: string
  nameEn: string
  months: number
  k: number
}

export interface BonusMalus {
  class: number
  k: number
}

export interface CarBrand {
  id: string
  name: string
  models: string[]
}

export interface OsagoDictionaries {
  regions: Region[]
  powerTiers: PowerTier[]
  durations: InsuranceDuration[]
  bonusMalus: BonusMalus[]
  carBrands: CarBrand[]
}
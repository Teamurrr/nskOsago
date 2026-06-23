import type { BonusMalus, InsuranceDuration, PowerTier, Region } from '../../../entities/dictionary'
import type { CalculatePremiumParams, PremiumCalculationResult } from './types'

const BASE_TARIFF = 1000

function getRegionCoefficient(regionId: string, regions: Region[]) {
  return regions.find((region) => region.id === regionId)?.kt ?? 1
}

function getPowerCoefficient(power: number, powerTiers: PowerTier[]) {
  return powerTiers.find((tier) => tier.max === null || power <= tier.max)?.k ?? 1
}

function getDurationCoefficient(durationId: string, durations: InsuranceDuration[]) {
  return durations.find((duration) => duration.id === durationId)?.k ?? 1
}

function getBonusMalusCoefficient(bonusMalusClass: number, bonusMalus: BonusMalus[]) {
  return bonusMalus.find((item) => item.class === bonusMalusClass)?.k ?? 1
}

function getAgeExperienceCoefficient(driverAge: number, driverExperience: number) {
  if (driverAge < 25 && driverExperience < 3) {
    return 1.8
  }

  if (driverAge < 25 || driverExperience < 3) {
    return 1.5
  }

  return 1
}

function getDriverAccessCoefficient(driverAccessType: 'LIMITED' | 'NO_LIMITS') {
  return driverAccessType === 'NO_LIMITS' ? 1.8 : 1
}

export function calculatePremium({
  input,
  dictionaries,
}: CalculatePremiumParams): PremiumCalculationResult {
  const territoryCoefficient = getRegionCoefficient(input.regionId, dictionaries.regions)
  const powerCoefficient = getPowerCoefficient(input.power, dictionaries.powerTiers)
  const durationCoefficient = getDurationCoefficient(input.durationId, dictionaries.durations)
  const bonusMalusCoefficient = getBonusMalusCoefficient(
    input.bonusMalusClass,
    dictionaries.bonusMalus,
  )
  const ageExperienceCoefficient = getAgeExperienceCoefficient(
    input.driverAge,
    input.driverExperience,
  )
  const driverAccessCoefficient = getDriverAccessCoefficient(input.driverAccessType)

  const total = Math.round(
    BASE_TARIFF *
      territoryCoefficient *
      powerCoefficient *
      ageExperienceCoefficient *
      driverAccessCoefficient *
      durationCoefficient *
      bonusMalusCoefficient,
  )

  return {
    total,
    breakdown: {
      baseTariff: BASE_TARIFF,
      territoryCoefficient,
      powerCoefficient,
      ageExperienceCoefficient,
      driverAccessCoefficient,
      durationCoefficient,
      bonusMalusCoefficient,
    },
  }
}
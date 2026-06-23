import type { OsagoDictionaries } from '../../../entities/dictionary'
import type { DriverAccessType, PolicyPremiumBreakdown } from '../../../entities/policy'

export interface PremiumCalculationInput {
  vehicleTypeId: string
  regionId: string
  power: number
  driverAge: number
  driverExperience: number
  driverAccessType: DriverAccessType
  durationId: string
  bonusMalusClass: number
}

export interface PremiumCalculationResult {
  total: number
  breakdown: PolicyPremiumBreakdown
}

export interface CalculatePremiumParams {
  input: PremiumCalculationInput
  dictionaries: OsagoDictionaries
}
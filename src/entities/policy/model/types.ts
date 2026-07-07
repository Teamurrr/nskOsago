export type DriverAccessType = 'LIMITED' | 'NO_LIMITS'
export type PolicyStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'PENDING_REVIEW'
export type InspectionVerificationStatus = 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW'

export interface VehicleInfo {
  brandId: string
  model: string
  registrationNumber: string
  vin: string
  year: number
  power: number
  regionId: string
}

export interface PersonInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  personalId: string
}

export interface DriverInfo extends PersonInfo {
  licenseNumber: string
  licenseIssuedAt: string
  bonusMalusClass: number
}

export interface PolicyPremiumBreakdown {
  baseTariff: number
  territoryCoefficient: number
  powerCoefficient: number
  ageExperienceCoefficient: number
  driverAccessCoefficient: number
  durationCoefficient: number
  bonusMalusCoefficient: number
}

export interface PolicyPremium {
  total: number
  breakdown: PolicyPremiumBreakdown
}

export interface Policy {
  id: string
  number: string
  status: PolicyStatus
  createdAt: string
  startsAt: string
  endsAt: string
  vehicle: VehicleInfo
  owner: PersonInfo
  drivers: DriverInfo[]
  driverAccessType: DriverAccessType
  durationId: string
  premium: PolicyPremium
}

export interface InspectionPhotoPayload {
  name: string
  size: number
  type: string
}

export interface InspectionVerificationResult {
  status: InspectionVerificationStatus
  confidence: number
  issues: string[]
}

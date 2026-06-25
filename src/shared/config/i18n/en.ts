export const en = {
  translation: {
    app: {
      title: 'NSK Insurance',
      subtitle: 'Agent workspace',
      product: 'OSAGO Demo',
    },
    navigation: {
      policies: 'Policies',
      calculator: 'Calculator',
      newPolicy: 'New Policy',
    },
    pages: {
      policies: {
        title: 'Policies',
        description: 'This page will contain the list of issued and draft insurance policies.',
      },
      calculator: {
        title: 'OSAGO Calculator',
        description: 'This page will contain the premium calculation form and breakdown.',
        form: {
          region: 'Region',
          vehicleType: 'Vehicle type',
          power: 'Power',
          ownerBirthDate: 'Owner birth date',
          driverExperience: 'Driver experience',
          driverAccess: 'Driver access',
          driverAccessLimited: 'Limited',
          driverAccessNoLimits: 'No limits',
          duration: 'Duration',
          bonusMalusClass: 'KBM (claim-free bonus)',
          bonusMalusClassValue: 'Class {{value}}',
        },
        validation: {
          required: 'Required field',
          minPower: 'Power must be at least {{value}}',
          minOwnerAge: 'Owner must be at least {{value}} years old',
          minDriverExperience: 'Driver experience cannot be negative',
          maxDriverExperience: 'Driver experience cannot be greater than {{value}} years',
        },
        result: {
          title: 'Premium result',
          total: 'Total',
          baseTariff: 'Base tariff',
          territory: 'Territory',
          power: 'Power',
          ageExperience: 'Age/experience',
          driverAccess: 'Driver access',
          duration: 'Duration',
          formula: 'Formula',
          powerTierUpTo: 'up to {{value}} hp',
          powerTierAbove: 'above 150 hp',
          bonusMalusClass: 'KBM (claim-free bonus)',
          bonusMalus: 'KBM (claim-free bonus)',
          ageExperienceYoungAndInexperienced:
            'younger than 25 and experience below 3 years',
          ageExperiencePartialRisk: 'one of the risk conditions is met',
          ageExperienceStandard: 'standard conditions',
        },
      },
      newPolicy: {
        title: 'New Policy',
        description: 'This page will contain the multi-step policy creation wizard.',
      },
      notFound: {
        title: '404',
        description: 'Page not found.',
        action: 'Go to policies',
      },
      empty: 'No policies yet.',
    },
  },
}

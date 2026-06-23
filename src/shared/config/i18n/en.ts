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
          power: 'Power',
          driverAge: 'Driver age',
          driverExperience: 'Driver experience',
          driverAccess: 'Driver access',
          driverAccessLimited: 'Limited',
          driverAccessNoLimits: 'No limits',
          duration: 'Duration',
          bonusMalusClass: 'Bonus-malus class',
          bonusMalusClassValue: 'Class {{value}}',
        },
        validation: {
          required: 'Required field',
          minPower: 'Power must be at least {{value}}',
          minDriverAge: 'Driver age must be at least {{value}}',
          minDriverExperience: 'Driver experience cannot be negative',
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
          bonusMalus: 'Bonus-malus',
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
export const ru = {
  translation: {
    app: {
      title: 'NSK Страхование',
      subtitle: 'Рабочее место агента',
      product: 'ОСАГО Demo',
    },
    navigation: {
      policies: 'Полисы',
      calculator: 'Калькулятор',
      newPolicy: 'Новый полис',
    },
    pages: {
      policies: {
        title: 'Полисы',
        description: 'Здесь будет список оформленных и черновых страховых полисов.',
      },
      calculator: {
        title: 'Калькулятор ОСАГО',
        description: 'Здесь будет форма расчета премии и разбивка коэффициентов.',
        form: {
          region: 'Регион',
          vehicleType: 'Тип ТС',
          power: 'Мощность',
          ownerBirthDate: 'Дата рождения собственника',
          driverExperience: 'Стаж водителя',
          driverAccess: 'Допуск к управлению',
          driverAccessLimited: 'Ограниченный',
          driverAccessNoLimits: 'Без ограничений',
          duration: 'Срок страхования',
          bonusMalusClass: 'КБМ (бонус безаварийности)',
          bonusMalusClassValue: 'Класс {{value}}',
        },
        validation: {
          required: 'Обязательное поле',
          minPower: 'Мощность должна быть не меньше {{value}}',
          minOwnerAge: 'Собственнику должно быть не меньше {{value}} лет',
          minDriverExperience: 'Стаж водителя не может быть отрицательным',
        },
        result: {
          title: 'Результат расчета',
          total: 'Итого',
          baseTariff: 'Базовый тариф',
          territory: 'Территория',
          power: 'Мощность',
          ageExperience: 'Возраст/стаж',
          driverAccess: 'Допуск',
          duration: 'Срок',
          bonusMalusClass: 'КБМ (бонус безаварийности)',
          bonusMalus: 'КБМ (бонус безаварийности)',
          formula: 'Формула',
          powerTierUpTo: 'до {{value}} л.с.',
          powerTierAbove: 'свыше 150 л.с.',
          ageExperienceYoungAndInexperienced:
            'моложе 25 лет и стаж меньше 3 лет',
          ageExperiencePartialRisk: 'выполняется одно из условий риска',
          ageExperienceStandard: 'стандартные условия',
        },
      },
      newPolicy: {
        title: 'Новый полис',
        description: 'Здесь будет пошаговый мастер оформления полиса.',
      },
      notFound: {
        title: '404',
        description: 'Страница не найдена.',
        action: 'Перейти к полисам',
      },
      empty: 'Полисы пока отсутствуют.',
    },
  },
}

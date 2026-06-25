export function calculateAge(birthDate: Date, currentDate = new Date()) {
  let age = currentDate.getFullYear() - birthDate.getFullYear()
  const monthDifference = currentDate.getMonth() - birthDate.getMonth()
  const hasNotHadBirthdayYet =
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())

  if (hasNotHadBirthdayYet) {
    age -= 1
  }

  return age
}

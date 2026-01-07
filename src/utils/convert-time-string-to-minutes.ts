export function convertTimeStringToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)

  return hours * 60 + minutes
}

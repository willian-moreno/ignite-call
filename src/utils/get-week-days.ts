export function getWeekDays() {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from({ length: 7 }, (_, day) => {
    const now = new Date()
    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), day + 1))
    const weekDay = formatter.format(date)

    return weekDay.charAt(0).toUpperCase() + weekDay.slice(1)
  })
}

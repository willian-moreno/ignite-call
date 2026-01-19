interface GetWeekDaysParams {
  short?: boolean
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from({ length: 7 }, (_, day) => {
    const date = new Date(Date.UTC(2021, 5, day))
    const weekDay = formatter.format(date)

    if (short) {
      return weekDay.substring(0, 3).toUpperCase()
    }

    return weekDay.charAt(0).toUpperCase() + weekDay.slice(1)
  })
}

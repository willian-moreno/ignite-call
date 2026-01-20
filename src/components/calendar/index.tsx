import { formatInLocaleTimeZone } from '@/utils/format-in-locale-time-zone'
import { getWeekDays } from '@/utils/get-week-days'
import {
  addDays,
  addMonths,
  getDate,
  getDay,
  getDaysInMonth,
  setDate,
  subDays,
  subMonths,
} from 'date-fns'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './styles'

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    return setDate(new Date(), 1)
  })

  const currentMonth = formatInLocaleTimeZone(currentDate, 'MMMM')

  const currentYear = formatInLocaleTimeZone(currentDate, 'yyyy')

  const calendarMonth = useMemo(() => {
    const daysInMonth = Array.from({
      length: getDaysInMonth(currentDate),
    }).map((_, i) => {
      return { day: setDate(currentDate, i + 1), disabled: false }
    })

    const firstMonthWeekDay = getDay(currentDate)

    const previousMonthFill = Array.from({
      length: firstMonthWeekDay,
    })
      .map((_, i) => {
        return { day: subDays(currentDate, i + 1), disabled: true }
      })
      .reverse()

    const lastDayInMonth = daysInMonth[daysInMonth.length - 1]

    const lastMonthWeekDay = getDay(lastDayInMonth.day)

    const nextMonthFill = Array.from({
      length: 6 - lastMonthWeekDay,
    }).map((_, i) => {
      return { day: addDays(lastDayInMonth.day, i + 1), disabled: true }
    })

    const calendarDays = [
      ...previousMonthFill,
      ...daysInMonth,
      ...nextMonthFill,
    ]

    const calendarWeeks = []

    for (let index = 0; index < calendarDays.length; index += 7) {
      calendarWeeks.push(calendarDays.slice(index, index + 7))
    }

    return calendarWeeks
  }, [currentDate])

  const shortWeekDays = getWeekDays({ short: true })

  function handlePreviousMonth() {
    setCurrentDate((state) => {
      return subMonths(state, 1)
    })
  }

  function handleNextMonth() {
    setCurrentDate((state) => {
      return addMonths(state, 1)
    })
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button
            title="Previous month"
            onClick={handlePreviousMonth}
          >
            <CaretLeft />
          </button>
          <button
            title="Next month"
            onClick={handleNextMonth}
          >
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarMonth.map((week, i) => (
            <tr key={i}>
              {week.map(({ day, disabled }) => (
                <td key={day.toString()}>
                  <CalendarDay disabled={disabled}>{getDate(day)}</CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}

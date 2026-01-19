import { formatInLocaleTimeZone } from '@/utils/format-in-locale-time-zone'
import { getWeekDays } from '@/utils/get-week-days'
import { addMonths, setDate, subMonths } from 'date-fns'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useState } from 'react'
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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <CalendarDay>1</CalendarDay>
            </td>
            <td>
              <CalendarDay>2</CalendarDay>
            </td>
            <td>
              <CalendarDay>3</CalendarDay>
            </td>
          </tr>
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}

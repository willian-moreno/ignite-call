import { api } from '@/lib/axios'
import { formatInLocaleTimeZone } from '@/utils/format-in-locale-time-zone'
import { getWeekDays } from '@/utils/get-week-days'
import { useQuery } from '@tanstack/react-query'
import {
  addDays,
  addMonths,
  endOfDay,
  getDate,
  getDay,
  getDaysInMonth,
  isBefore,
  setDate,
  subDays,
  subMonths,
} from 'date-fns'
import { useRouter } from 'next/router'
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

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

interface BlockedDates {
  blockedWeekDays: number[]
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    const date = selectedDate instanceof Date ? selectedDate : new Date()
    return setDate(date, 1)
  })

  const router = useRouter()

  const currentMonth = formatInLocaleTimeZone(currentDate, 'MMMM')

  const currentYear = formatInLocaleTimeZone(currentDate, 'yyyy')

  const username = String(router.query.username)

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: [
      'blocked-dates',
      currentDate.getFullYear(),
      currentDate.getMonth(),
    ],
    queryFn: async () => {
      const response = await api.get<BlockedDates>(
        `/users/${username}/blocked-dates`,
        {
          params: {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
          },
        },
      )

      return response.data
    },
  })

  const calendar = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonth = Array.from({
      length: getDaysInMonth(currentDate),
    }).map((_, i) => {
      const day = setDate(currentDate, i + 1)
      const date = getDate(day)
      const key = day.toString()

      return {
        key,
        day,
        date,
        disabled:
          isBefore(endOfDay(day), new Date()) ||
          blockedDates.blockedWeekDays.includes(getDay(day)),
      }
    })

    const firstMonthWeekDay = getDay(currentDate)

    const previousMonthFill = Array.from({
      length: firstMonthWeekDay,
    })
      .map((_, i) => {
        const day = subDays(currentDate, i + 1)
        const date = getDate(day)
        const key = day.toString()

        return {
          key,
          day,
          date,
          disabled: true,
        }
      })
      .reverse()

    const lastDayInMonth = daysInMonth[daysInMonth.length - 1]

    const lastMonthWeekDay = getDay(lastDayInMonth.day)

    const nextMonthFill = Array.from({
      length: 6 - lastMonthWeekDay,
    }).map((_, i) => {
      const day = addDays(lastDayInMonth.day, i + 1)
      const date = getDate(day)
      const key = day.toString()

      return {
        key,
        day,
        date,
        disabled: true,
      }
    })

    const calendarDays = [
      ...previousMonthFill,
      ...daysInMonth,
      ...nextMonthFill,
    ]

    const calendarWeeks = []

    for (let index = 0; index < calendarDays.length; index += 7) {
      calendarWeeks.push({
        week: index / 7 + 1,
        days: calendarDays.slice(index, index + 7),
      })
    }

    return calendarWeeks
  }, [currentDate, blockedDates])

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
          {calendar.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ key, day, date, disabled }) => (
                <td key={key}>
                  <CalendarDay
                    disabled={disabled}
                    onClick={() => onDateSelected(day)}
                  >
                    {date}
                  </CalendarDay>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}

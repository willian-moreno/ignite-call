import { Calendar } from '@/components/calendar'
import { api } from '@/lib/axios'
import { formatInLocaleTimeZone } from '@/utils/format-in-locale-time-zone'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const isDateSelected = selectedDate instanceof Date

  const username = String(router.query.username)

  const weekDayOfSelectedDate = isDateSelected
    ? formatInLocaleTimeZone(selectedDate, 'EEEE')
    : null

  const dateAndMonthOfSelectedDate = isDateSelected
    ? formatInLocaleTimeZone(selectedDate, "dd 'de' MMMM")
    : null

  const selectedDateWithoutTime = selectedDate
    ? formatInLocaleTimeZone(selectedDate, 'yyyy-MM-dd')
    : null

  const { data: availability } = useQuery<Availability>({
    queryKey: ['availability', selectedDateWithoutTime],
    queryFn: async () => {
      const response = await api.get<Availability>(
        `/users/${username}/availability`,
        {
          params: {
            date: selectedDateWithoutTime,
          },
        },
      )

      return response.data
    },
    enabled: !!selectedDate,
  })

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar
        selectedDate={selectedDate}
        onDateSelected={setSelectedDate}
      />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDayOfSelectedDate} <span>{dateAndMonthOfSelectedDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}

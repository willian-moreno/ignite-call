import { Calendar } from '@/components/calendar'
import { api } from '@/lib/axios'
import { formatInLocaleTimeZone } from '@/utils/format-in-locale-time-zone'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [availability, setAvailability] = useState(null)

  const router = useRouter()

  const isDateSelected = selectedDate instanceof Date

  const username = String(router.query.username)

  const weekDayOfSelectedDate = isDateSelected
    ? formatInLocaleTimeZone(selectedDate, 'EEEE')
    : null

  const dateAndMonthOfSelectedDate = isDateSelected
    ? formatInLocaleTimeZone(selectedDate, "dd 'de' MMMM")
    : null

  useEffect(() => {
    if (!selectedDate) {
      return
    }

    ;(async () => {
      try {
        const response = await api.get<{
          availability: number[]
          possibleTimes?: number[]
        }>(`/users/${username}/availability`, {
          params: {
            date: formatInLocaleTimeZone(selectedDate, 'yyyy-MM-dd'),
          },
        })

        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [selectedDate, username])

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
            <TimePickerItem>08:00h</TimePickerItem>
            <TimePickerItem>09:00h</TimePickerItem>
            <TimePickerItem>10:00h</TimePickerItem>
            <TimePickerItem>11:00h</TimePickerItem>
            <TimePickerItem>12:00h</TimePickerItem>
            <TimePickerItem>13:00h</TimePickerItem>
            <TimePickerItem>14:00h</TimePickerItem>
            <TimePickerItem>15:00h</TimePickerItem>
            <TimePickerItem>16:00h</TimePickerItem>
            <TimePickerItem>17:00h</TimePickerItem>
            <TimePickerItem>18:00h</TimePickerItem>
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}

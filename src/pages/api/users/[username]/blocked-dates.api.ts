import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ message: 'Year or month not specified.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
      SELECT EXTRACT(DAY FROM scd.date) AS date
           , COUNT(scd.date) AS amount
           , ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60) AS size
        FROM schedulings scd
   LEFT JOIN user_time_intervals uti
          ON uti.week_day = WEEKDAY(DATE_ADD(scd.date, INTERVAL 1 DAY))
         AND uti.user_id = scd.user_id
       WHERE scd.user_id = ${user.id}
         AND DATE_FORMAT(scd.date, "%Y-%m") = ${`${year}-${month}`}
    GROUP BY EXTRACT(DAY FROM scd.date)
           , ((uti.time_end_in_minutes - uti.time_start_in_minutes) / 60)
      HAVING amount >= size
  `

  const blockedDates = blockedDatesRaw.map((item) => item.date)

  return res.json({ blockedWeekDays, blockedDates })
}

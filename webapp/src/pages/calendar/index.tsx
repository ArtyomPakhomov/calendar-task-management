import cn from 'classnames'
import { useState } from 'react'
import { withPageWrapper } from '../../lib/pageWrapper'
import css from './index.module.scss'

export const CalendarPage = withPageWrapper({
  title: 'Calendar',
})(() => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  // Новая функция для возврата к текущей дате
  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthName = currentDate
    .toLocaleDateString('ru-RU', {
      month: 'long',
      year: 'numeric',
    })
    .replace(' г.', '')

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const prevMonthLastDay = new Date(year, month, 0)

  // (0 - воскресенье, 1 - понедельник...)
  const firstDayCurrentMonth = firstDay.getDay() || 7 // Приводим к формату 1-7

  // Количество дней предыдущего месяца для отображения
  const daysFromPrevMonthCount = firstDayCurrentMonth - 1

  const calendarDates = []

  // Добавляем дни предыдущего месяца
  for (let i = daysFromPrevMonthCount; i > 0; i--) {
    calendarDates.push({
      day: prevMonthLastDay.getDate() - i + 1,
      month: 'prev',
      date: new Date(year, month - 1, prevMonthLastDay.getDate() - i + 1),
    })
  }

  // Добавляем дни текущего месяца
  for (let i = 1; i <= lastDay.getDate(); i++) {
    calendarDates.push({
      day: i,
      month: 'current',
      date: new Date(year, month, i),
    })
  }

  // Добавляем дни следующего месяца
  const totalCells = 42
  const daysFromNextMonth = totalCells - calendarDates.length

  for (let i = 1; i <= daysFromNextMonth; i++) {
    calendarDates.push({
      day: i,
      month: 'next',
      date: new Date(year, month + 1, i),
    })
  }

  return (
    <div>
      <h1>Calendar</h1>
      <div className={css.calendar}>
        <div className={css.month_title}>{monthName}</div>
        <div className={css.calendar_header}>
          <div className={css.nav_controls}>
            <button className={css.nav_button} onClick={handlePrevMonth}>
              ←
            </button>

            <button className={css.nav_button} onClick={handleNextMonth}>
              →
            </button>
          </div>
          <button className={css.today_button} onClick={handleToday}>
            Сегодня
          </button>
        </div>

        <div className={css.calendar_weekdays}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
            <div className={css.calendar_weekday} key={day}>
              {day}
            </div>
          ))}
        </div>

        <div className={css.calendar_days}>
          {calendarDates.map((day, index) => {
            const isToday = new Date().toDateString() === day.date.toDateString()
            return (
              <div
                className={cn(css.calendar_day, {
                  [css.today]: isToday,
                  [css.prevOrNext]: day.month !== 'current',
                })}
                key={index}
              >
                {day.date.getDate()}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

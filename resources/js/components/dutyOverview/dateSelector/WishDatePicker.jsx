import React, { useState } from 'react'
import moment from 'moment'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import './WishDatePicker.scss'

/**
 * Inline-Kalender für die Wunschauswahl. Liefert {day, month, year}
 * (Monat 1–12). Bewusst inline (kein Popover), da im Modal eingebettet.
 */
function WishDatePicker({ value, onChange }) {
  moment.locale('de')
  const today = moment()
  const initial =
    value && value.year && value.month
      ? moment(`${value.year}-${value.month}-1`, 'YYYY-M-D')
      : today.clone()

  const [view, setView] = useState({
    year: initial.year(),
    month: initial.month() + 1, // 1–12
  })

  const first = moment(`${view.year}-${view.month}-1`, 'YYYY-M-D')
  const daysInMonth = first.daysInMonth()
  // moment: 0=So..6=Sa -> auf Mo=0..So=6 umstellen
  const lead = (first.day() + 6) % 7
  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

  const step = (dir) => {
    let m = view.month + dir
    let y = view.year
    if (m < 1) {
      m = 12
      y -= 1
    } else if (m > 12) {
      m = 1
      y += 1
    }
    setView({ year: y, month: m })
  }

  const pick = (day) =>
    onChange({ day, month: view.month, year: view.year })

  const cells = []
  for (let i = 0; i < lead; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isSelected = (d) =>
    value &&
    Number(value.day) === d &&
    Number(value.month) === view.month &&
    Number(value.year) === view.year
  const isToday = (d) =>
    today.date() === d &&
    today.month() + 1 === view.month &&
    today.year() === view.year

  return (
    <div className="wish-datepicker">
      <div className="wish-datepicker__head">
        <button
          type="button"
          className="wish-datepicker__nav"
          aria-label="Vorheriger Monat"
          onClick={() => step(-1)}
        >
          <IoChevronBack />
        </button>
        <span className="wish-datepicker__title">
          {first.format('MMMM YYYY')}
        </span>
        <button
          type="button"
          className="wish-datepicker__nav"
          aria-label="Nächster Monat"
          onClick={() => step(1)}
        >
          <IoChevronForward />
        </button>
      </div>

      <div className="wish-datepicker__weekdays">
        {weekdays.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="wish-datepicker__grid">
        {cells.map((d, i) =>
          d === null ? (
            <span key={`x${i}`} className="wish-datepicker__empty" />
          ) : (
            <button
              type="button"
              key={d}
              className={[
                'wish-datepicker__day',
                isSelected(d) ? 'is-selected' : '',
                isToday(d) ? 'is-today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={isSelected(d)}
              onClick={() => pick(d)}
            >
              {d}
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default WishDatePicker

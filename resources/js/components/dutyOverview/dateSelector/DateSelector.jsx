import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import {
  IoChevronBack,
  IoChevronForward,
  IoCalendarClearOutline,
} from 'react-icons/io5'
import './DateSelector.scss'

function clampStep(month, year, dir) {
  let m = Number(month) + dir
  let y = Number(year)
  if (m < 1) {
    m = 12
    y -= 1
  } else if (m > 12) {
    m = 1
    y += 1
  }
  return { month: m.toString(), year: y.toString() }
}

function DateSelector(props) {
  const { dateSelectorData, setDateSelector } = props
  const month = Number(dateSelectorData.month)
  const year = Number(dateSelectorData.year)

  const [open, setOpen] = useState(false)
  const [panelYear, setPanelYear] = useState(year)
  const rootRef = useRef(null)

  const now = moment()
  const todayMonth = Number(now.format('M'))
  const todayYear = Number(now.format('YYYY'))

  // Panel beim Öffnen mit dem aktuell gewählten Jahr synchronisieren.
  useEffect(() => {
    if (open) setPanelYear(year)
  }, [open, year])

  // Schließen bei Klick außerhalb bzw. Escape.
  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const step = (dir) => setDateSelector(clampStep(month, year, dir))

  const pickMonth = (mIdx) => {
    setDateSelector({ month: (mIdx + 1).toString(), year: panelYear.toString() })
    setOpen(false)
  }

  const goToday = () => {
    setDateSelector({
      month: todayMonth.toString(),
      year: todayYear.toString(),
    })
    setOpen(false)
  }

  const label = `${moment(dateSelectorData.month, 'M').format('MMMM')} ${year}`
  const monthsShort = moment.monthsShort()

  return (
    <div className="date-selector" ref={rootRef}>
      <div className="date-selector__bar">
        <button
          type="button"
          className="date-selector__nav"
          id="prev-month-button"
          aria-label="Vorheriger Monat"
          onClick={() => step(-1)}
        >
          <IoChevronBack />
        </button>

        <button
          type="button"
          className="date-selector__current"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <IoCalendarClearOutline className="date-selector__current-icon" />
          <span className="date-selector__label">{label}</span>
        </button>

        <button
          type="button"
          className="date-selector__nav"
          id="next-month-button"
          aria-label="Nächster Monat"
          onClick={() => step(1)}
        >
          <IoChevronForward />
        </button>
      </div>

      {open && (
        <div className="date-selector__panel" role="dialog" aria-label="Monat wählen">
          <div className="date-selector__panel-head">
            <button
              type="button"
              className="date-selector__nav"
              aria-label="Vorheriges Jahr"
              onClick={() => setPanelYear((y) => y - 1)}
            >
              <IoChevronBack />
            </button>
            <span className="date-selector__year">{panelYear}</span>
            <button
              type="button"
              className="date-selector__nav"
              aria-label="Nächstes Jahr"
              onClick={() => setPanelYear((y) => y + 1)}
            >
              <IoChevronForward />
            </button>
          </div>

          <div className="date-selector__grid">
            {monthsShort.map((name, idx) => {
              const isSelected = idx + 1 === month && panelYear === year
              const isToday =
                idx + 1 === todayMonth && panelYear === todayYear
              return (
                <button
                  type="button"
                  key={name}
                  className={[
                    'date-selector__month',
                    isSelected ? 'is-selected' : '',
                    isToday ? 'is-today' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-pressed={isSelected}
                  onClick={() => pickMonth(idx)}
                >
                  {name}
                </button>
              )
            })}
          </div>

          <div className="date-selector__panel-foot">
            <button
              type="button"
              className="date-selector__today"
              onClick={goToday}
            >
              Heute
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateSelector

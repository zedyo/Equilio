import React from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft } from 'react-icons/fi'
import './shared.scss'

/**
 * Einheitlicher Seitenkopf: Titel, optionale Beschreibung, optionaler
 * Zurück-Link, Primäraktion (rechts) und Status-Chips. Ersetzt die
 * uneinheitlichen Breadcrumb-/Card.Header-Konstruktionen.
 */
function PageHeader({ title, description, backTo, backLabel, actions, chips }) {
  return (
    <div className="eq-page-header">
      <div className="eq-page-header__main">
        {backTo && (
          <Link to={backTo} className="eq-page-header__back">
            <FiChevronLeft />
            {backLabel || 'Zurück'}
          </Link>
        )}
        <h1 className="eq-page-header__title">{title}</h1>
        {description && (
          <p className="eq-page-header__desc">{description}</p>
        )}
        {chips && chips.length > 0 && (
          <div className="eq-page-header__chips">
            {chips.map((c, i) => (
              <span
                key={i}
                className={`eq-chip eq-chip--${c.tone || 'neutral'}`}
              >
                {c.label}
              </span>
            ))}
          </div>
        )}
      </div>
      {actions && <div className="eq-page-header__actions">{actions}</div>}
    </div>
  )
}

export default PageHeader

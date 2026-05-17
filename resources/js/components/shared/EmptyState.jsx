import React from 'react'
import './shared.scss'

/**
 * Gestalteter Leerzustand statt roher Listen ohne Inhalt bzw.
 * "... loading"-Überschriften.
 */
function EmptyState({ icon, title, description, action }) {
  return (
    <div className="eq-empty">
      {icon && <div className="eq-empty__icon">{icon}</div>}
      <div className="eq-empty__title">{title}</div>
      {description && <p className="eq-empty__desc">{description}</p>}
      {action && <div className="eq-empty__action">{action}</div>}
    </div>
  )
}

export default EmptyState

/**
 * HealthSummary Component
 *
 * Displays derived health status for a blog.
 * Health is derived, never manually set.
 *
 * // This UI describes system state.
 * // It must never be required to change system state.
 */

import type { BlogHealth, HealthLevel } from '../../lib/deriveHealth'

interface HealthSummaryProps {
  health: BlogHealth
}

const HEALTH_ICONS: Record<HealthLevel, string> = {
  healthy: '🟢',
  incomplete: '🟡',
  risk: '🔴',
}

const HEALTH_LABELS: Record<HealthLevel, string> = {
  healthy: 'Healthy',
  incomplete: 'Incomplete',
  risk: 'Risk',
}

export function HealthSummary({ health }: HealthSummaryProps) {
  return (
    <div className="health-summary">
      <div className="health-status">
        <span className="health-icon">{HEALTH_ICONS[health.level]}</span>
        <span className="health-label">{HEALTH_LABELS[health.level]}</span>
      </div>
      <div className="health-counts">
        {health.missing.critical > 0 && (
          <span className="health-count critical">
            {health.missing.critical} critical missing
          </span>
        )}
        {health.missing.important > 0 && (
          <span className="health-count important">
            {health.missing.important} important missing
          </span>
        )}
        {health.missing.optional > 0 && (
          <span className="health-count optional">
            {health.missing.optional} optional missing
          </span>
        )}
        {health.missing.critical === 0 &&
          health.missing.important === 0 &&
          health.missing.optional === 0 && (
            <span className="health-count complete">All assets complete</span>
          )}
      </div>
      {health.reasons.length > 0 && (
        <div className="health-errors">
          {health.reasons.map((reason, i) => (
            <span key={i} className="health-error">{reason}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default HealthSummary

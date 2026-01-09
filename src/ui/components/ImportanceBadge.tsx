/**
 * ImportanceBadge Component
 *
 * Displays asset importance level with muted styling.
 * No alarmism - just factual indication.
 */

import type { AssetImportance } from '../../schema'

interface ImportanceBadgeProps {
  importance: AssetImportance
}

const IMPORTANCE_LABELS: Record<AssetImportance, string> = {
  critical: 'Critical',
  important: 'Important',
  optional: 'Optional',
}

export function ImportanceBadge({ importance }: ImportanceBadgeProps) {
  return (
    <span className={`importance-badge ${importance}`}>
      {IMPORTANCE_LABELS[importance]}
    </span>
  )
}

export default ImportanceBadge

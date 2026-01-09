/**
 * healthRank
 *
 * Returns numeric rank for sorting by health severity.
 * Lower = worse = appears first
 */

import type { HealthLevel } from './deriveHealth'

export function healthRank(level: HealthLevel): number {
  switch (level) {
    case 'risk':
      return 0
    case 'incomplete':
      return 1
    case 'healthy':
      return 2
    default:
      return 99
  }
}

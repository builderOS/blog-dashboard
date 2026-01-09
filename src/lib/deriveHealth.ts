/**
 * deriveHealth is pure.
 * - No I/O
 * - No API calls
 * - No mutation
 * - No side effects
 *
 * Health is always derived, never stored.
 */

import type { Blog } from '../schema'

// ============================================================================
// Types
// ============================================================================

export type HealthLevel = 'healthy' | 'incomplete' | 'risk'

export interface BlogHealth {
  level: HealthLevel
  missing: {
    critical: number
    important: number
    optional: number
  }
  reasons: string[] // human-readable explanations
}

// ============================================================================
// Status Classification
// ============================================================================

const BAD_STATUSES = new Set(['not_created', 'error'])
// OK statuses: 'created', 'connected', 'verified', 'skipped'

// ============================================================================
// deriveHealth - Pure Function
// ============================================================================

export function deriveHealth(blog: Blog): BlogHealth {
  const result: BlogHealth = {
    level: 'healthy',
    missing: {
      critical: 0,
      important: 0,
      optional: 0,
    },
    reasons: [],
  }

  for (const asset of blog.assets) {
    if (BAD_STATUSES.has(asset.status)) {
      result.missing[asset.importance]++

      if (asset.importance === 'critical') {
        result.reasons.push(
          `Critical asset missing or broken: ${asset.type}`
        )
      }
    }
  }

  // Determine overall level
  // - "Skipped" is never counted as missing
  // - Optional assets never degrade health below "incomplete"
  // - One missing critical asset = risk, no debate
  if (result.missing.critical > 0) {
    result.level = 'risk'
  } else if (result.missing.important > 0) {
    result.level = 'incomplete'
  } else {
    result.level = 'healthy'
  }

  return result
}

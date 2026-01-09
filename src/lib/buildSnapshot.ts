/**
 * buildSnapshot
 *
 * Builds an exportable snapshot of dashboard state.
 * All data is derived, nothing stored.
 */

import type { Blog } from '../schema'
import { deriveHealth } from './deriveHealth'
import { deriveSectionCompleteness } from './deriveSectionCompleteness'

export interface BlogSnapshot {
  id: string
  domain: string
  displayName: string
  status: string
  health: string
  missingCritical: number
  missingImportant: number
  sections: {
    internal: { verified: number; total: number }
    external: { verified: number; total: number }
    distribution: { verified: number; total: number }
  }
}

export function buildSnapshot(blogs: Blog[]): BlogSnapshot[] {
  return blogs.map(blog => {
    const health = deriveHealth(blog)

    return {
      id: blog.id,
      domain: blog.domain,
      displayName: blog.displayName,
      status: blog.status,
      health: health.level,
      missingCritical: health.missing.critical,
      missingImportant: health.missing.important,
      sections: {
        internal: deriveSectionCompleteness(blog.assets, 'internal'),
        external: deriveSectionCompleteness(blog.assets, 'external'),
        distribution: deriveSectionCompleteness(blog.assets, 'distribution'),
      },
    }
  })
}

export function snapshotToCSV(snapshots: BlogSnapshot[]): string {
  const headers = [
    'Domain',
    'Name',
    'Status',
    'Health',
    'Critical Missing',
    'Important Missing',
    'Internal Verified',
    'External Verified',
  ]

  const rows = snapshots.map(s => [
    s.domain,
    s.displayName,
    s.status,
    s.health,
    s.missingCritical,
    s.missingImportant,
    `${s.sections.internal.verified}/${s.sections.internal.total}`,
    `${s.sections.external.verified}/${s.sections.external.total}`,
  ])

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

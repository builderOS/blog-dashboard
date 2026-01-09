/**
 * StatusBadge Component
 *
 * Displays asset status with appropriate visual treatment.
 * Skipped must look calm and deliberate, not broken.
 */

import type { AssetStatus, BlogStatus } from '../../schema'

interface StatusBadgeProps {
  status: AssetStatus | BlogStatus
}

const STATUS_LABELS: Record<AssetStatus, string> = {
  verified: 'Verified',
  connected: 'Connected',
  created: 'Created',
  not_created: 'Not Created',
  error: 'Error',
  skipped: 'Skipped',
}

const BLOG_STATUS_LABELS: Record<BlogStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  archived: 'Archived',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUS_LABELS[status as AssetStatus] ?? BLOG_STATUS_LABELS[status as BlogStatus] ?? status
  return (
    <span className={`asset-status ${status}`}>
      {label}
    </span>
  )
}

export default StatusBadge

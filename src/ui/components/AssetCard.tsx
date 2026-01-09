/**
 * AssetCard Component
 *
 * Displays a single asset with status, importance, and links.
 * This UI may describe system state. It must never change it.
 */

import type { Asset } from '../../schema'
import StatusBadge from './StatusBadge'

interface AssetCardProps {
  asset: Asset
}

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <div className="asset-row">
      <div className={`asset-importance ${asset.importance}`} title={asset.importance} />
      <div className="asset-info">
        <div className="asset-label">{asset.label}</div>
        {asset.notes && <div className="asset-notes">{asset.notes}</div>}
      </div>
      <StatusBadge status={asset.status} />
      {asset.url && (
        <a
          href={asset.url}
          target="_blank"
          rel="noopener noreferrer"
          className="asset-link"
        >
          Open
        </a>
      )}
    </div>
  )
}

export default AssetCard

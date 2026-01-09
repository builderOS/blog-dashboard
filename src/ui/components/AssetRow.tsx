/**
 * AssetRow Component
 *
 * Single row in the asset table.
 * No logic. No branching. Just rendering.
 */

import type { Asset } from '../../schema'
import StatusBadge from './StatusBadge'
import ImportanceBadge from './ImportanceBadge'

interface AssetRowProps {
  asset: Asset
}

export function AssetRow({ asset }: AssetRowProps) {
  return (
    <tr className="asset-table-row">
      <td className="asset-table-cell">{asset.label}</td>
      <td className="asset-table-cell">
        <ImportanceBadge importance={asset.importance} />
      </td>
      <td className="asset-table-cell">
        <StatusBadge status={asset.status} />
      </td>
      <td className="asset-table-cell">
        {asset.url ? (
          <a href={asset.url} target="_blank" rel="noopener noreferrer">
            Open
          </a>
        ) : (
          <span className="no-link">—</span>
        )}
      </td>
      <td className="asset-table-cell asset-notes-cell">
        {asset.notes || '—'}
      </td>
    </tr>
  )
}

export default AssetRow

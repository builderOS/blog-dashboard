/**
 * AssetTable Component
 *
 * Grouped, reusable table for displaying assets by category.
 *
 * This component:
 * - Cannot mutate assets
 * - Cannot change health
 * - Cannot trigger actions
 * - Makes missing criticals obvious
 * - Makes skipped assets explicit
 * - Works for every future platform
 */

import type { Asset, AssetCategory } from '../../schema'
import AssetRow from './AssetRow'

interface AssetTableProps {
  assets: Asset[]
  category: AssetCategory
  title?: string
  subtitle?: string
}

const CATEGORY_TITLES: Record<AssetCategory, string> = {
  internal: 'Internal Factory Assets',
  external: 'External Platforms',
  distribution: 'Distribution Readiness',
}

export function AssetTable({ assets, category, title, subtitle }: AssetTableProps) {
  const filtered = assets.filter(a => a.category === category)

  if (filtered.length === 0) return null

  const displayTitle = title || CATEGORY_TITLES[category]

  return (
    <section className="asset-table-section">
      <h3 className="asset-table-title">{displayTitle}</h3>
      {subtitle && <p className="asset-table-subtitle">{subtitle}</p>}

      <table className="asset-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Importance</th>
            <th>Status</th>
            <th>Link</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(asset => (
            <AssetRow key={asset.assetId} asset={asset} />
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default AssetTable

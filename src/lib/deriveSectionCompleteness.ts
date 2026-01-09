/**
 * deriveSectionCompleteness
 *
 * Pure function to calculate section completeness.
 * Verified = verified OR connected
 * Skipped counts toward total but not verified
 */

import type { Asset, AssetCategory } from '../schema'

export interface SectionCompleteness {
  total: number
  verified: number
}

export function deriveSectionCompleteness(
  assets: Asset[],
  category: AssetCategory
): SectionCompleteness {
  const sectionAssets = assets.filter(a => a.category === category)

  const verified = sectionAssets.filter(a =>
    a.status === 'verified' || a.status === 'connected'
  ).length

  return {
    total: sectionAssets.length,
    verified,
  }
}

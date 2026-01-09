/**
 * Blog Dashboard Data Schema
 *
 * READ-ONLY operational dashboard for static blog factory.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Assets describe reality. They do not cause it.                 │
 * │  This system tracks state. It does not enforce it.              │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Canonical schema: JSON (checked into blog-dashboard)
 * Optional persistence: SQL mirrors JSON, never replaces it
 *
 * NON-NEGOTIABLE: This system never modifies source-of-truth systems.
 */

// ============================================================================
// Core Enums
// ============================================================================

export type BlogStatus = 'active' | 'paused' | 'archived';

export type AssetCategory = 'internal' | 'external' | 'distribution';

export type AssetImportance = 'critical' | 'important' | 'optional';

export type AssetStatus =
  | 'not_created'  // Asset does not exist yet
  | 'created'      // Asset exists but not connected/configured
  | 'connected'    // Asset is connected to the system
  | 'verified'     // Asset is verified working
  | 'error'        // Asset has an error/issue
  | 'skipped';     // Intentionally skipped (documented decision) - FIRST CLASS STATE

export type AssetType =
  // Internal factory
  | 'github_repo'
  | 'lovable_project'
  | 'production_site'
  // External platforms
  | 'google_search_console'
  | 'google_analytics'
  | 'facebook_page'
  | 'instagram_account'
  | 'x_account'
  // Distribution
  | 'og_metadata'
  | 'share_image'
  | 'rss_feed';

export type EvidenceType = 'manual_note' | 'api_check' | 'screenshot' | 'link';

// ============================================================================
// Asset Evidence
// ============================================================================

/**
 * Evidence lets you prove why a status is true without automation.
 * Prevents "who set this?" confusion later.
 */
export interface AssetEvidence {
  type: EvidenceType;
  value: string;
  recordedAt: string; // ISO timestamp
}

// ============================================================================
// Asset
// ============================================================================

export interface Asset {
  assetId: string;
  type: AssetType;
  category: AssetCategory;
  importance: AssetImportance;
  status: AssetStatus;
  label: string;
  url?: string;
  externalId?: string;        // Platform-specific ID
  lastCheckedAt?: string;     // ISO timestamp
  notes?: string;             // Freeform explanation or decision log
  evidence: AssetEvidence[];
}

// ============================================================================
// Blog
// ============================================================================

export interface Blog {
  id: string;                 // Stable identifier (use domain)
  displayName: string;        // Human-friendly name
  domain: string;             // Canonical domain
  status: BlogStatus;
  notes?: string;             // Freeform human memory
  assets: Asset[];
}

// ============================================================================
// Dashboard State (JSON file structure)
// ============================================================================

export interface BlogsData {
  schemaVersion: string;
  blogs: Blog[];
}

// ============================================================================
// Asset Type Definitions (for UI rendering)
// ============================================================================

export interface AssetTypeDefinition {
  type: AssetType;
  category: AssetCategory;
  defaultImportance: AssetImportance;
  label: string;
  description: string;
}

export const ASSET_TYPE_DEFINITIONS: AssetTypeDefinition[] = [
  // Internal Factory (CRITICAL)
  {
    type: 'github_repo',
    category: 'internal',
    defaultImportance: 'critical',
    label: 'GitHub Repository',
    description: 'Designer/content repository',
  },
  {
    type: 'lovable_project',
    category: 'internal',
    defaultImportance: 'critical',
    label: 'Lovable Project',
    description: 'Lovable project for site generation',
  },
  {
    type: 'production_site',
    category: 'internal',
    defaultImportance: 'critical',
    label: 'Production Site',
    description: 'Live production website',
  },

  // External Platforms
  {
    type: 'google_search_console',
    category: 'external',
    defaultImportance: 'critical',
    label: 'Google Search Console',
    description: 'Search Console property for SEO',
  },
  {
    type: 'google_analytics',
    category: 'external',
    defaultImportance: 'important',
    label: 'Google Analytics',
    description: 'Analytics property for traffic tracking',
  },
  {
    type: 'facebook_page',
    category: 'external',
    defaultImportance: 'optional',
    label: 'Facebook Page',
    description: 'Facebook page for social presence',
  },
  {
    type: 'instagram_account',
    category: 'external',
    defaultImportance: 'optional',
    label: 'Instagram',
    description: 'Instagram account for social presence',
  },
  {
    type: 'x_account',
    category: 'external',
    defaultImportance: 'optional',
    label: 'X (Twitter)',
    description: 'Twitter/X account for social presence',
  },

  // Distribution
  {
    type: 'og_metadata',
    category: 'distribution',
    defaultImportance: 'optional',
    label: 'Open Graph Metadata',
    description: 'OG tags present for social sharing',
  },
  {
    type: 'share_image',
    category: 'distribution',
    defaultImportance: 'optional',
    label: 'Share Image',
    description: 'Default social share image',
  },
  {
    type: 'rss_feed',
    category: 'distribution',
    defaultImportance: 'optional',
    label: 'RSS/Atom Feed',
    description: 'Syndication feed available',
  },
];

// ============================================================================
// Helpers
// ============================================================================

export function getAssetTypeDefinition(type: AssetType): AssetTypeDefinition | undefined {
  return ASSET_TYPE_DEFINITIONS.find(def => def.type === type);
}

export function isCompleteStatus(status: AssetStatus): boolean {
  return status === 'verified' || status === 'connected' || status === 'skipped';
}

export function isErrorStatus(status: AssetStatus): boolean {
  return status === 'error';
}

// ============================================================================
// Health Calculation
// ============================================================================

export type HealthLevel = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface BlogHealth {
  blogId: string;
  level: HealthLevel;
  criticalComplete: number;
  criticalTotal: number;
  importantComplete: number;
  importantTotal: number;
  optionalComplete: number;
  optionalTotal: number;
  errors: string[];
}

export function calculateHealth(blog: Blog): BlogHealth {
  const health: BlogHealth = {
    blogId: blog.id,
    level: 'unknown',
    criticalComplete: 0,
    criticalTotal: 0,
    importantComplete: 0,
    importantTotal: 0,
    optionalComplete: 0,
    optionalTotal: 0,
    errors: [],
  };

  for (const asset of blog.assets) {
    const complete = isCompleteStatus(asset.status);

    switch (asset.importance) {
      case 'critical':
        health.criticalTotal++;
        if (complete) health.criticalComplete++;
        break;
      case 'important':
        health.importantTotal++;
        if (complete) health.importantComplete++;
        break;
      case 'optional':
        health.optionalTotal++;
        if (complete) health.optionalComplete++;
        break;
    }

    if (asset.status === 'error') {
      health.errors.push(`${asset.label}: error state`);
    }
  }

  // Calculate overall health level
  if (health.criticalTotal === 0) {
    health.level = 'unknown';
  } else if (health.criticalComplete < health.criticalTotal) {
    health.level = 'critical';
  } else if (health.errors.length > 0) {
    health.level = 'warning';
  } else if (health.importantComplete < health.importantTotal) {
    health.level = 'warning';
  } else {
    health.level = 'healthy';
  }

  return health;
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createEmptyBlog(domain: string, displayName: string): Blog {
  return {
    id: domain,
    displayName,
    domain,
    status: 'active',
    assets: [],
  };
}

export function createAsset(
  assetId: string,
  type: AssetType,
  label: string,
  overrides: Partial<Asset> = {}
): Asset {
  const def = getAssetTypeDefinition(type);
  return {
    assetId,
    type,
    category: def?.category ?? 'internal',
    importance: def?.defaultImportance ?? 'optional',
    status: 'not_created',
    label,
    evidence: [],
    ...overrides,
  };
}

export function addEvidence(
  asset: Asset,
  type: EvidenceType,
  value: string
): Asset {
  return {
    ...asset,
    evidence: [
      ...asset.evidence,
      {
        type,
        value,
        recordedAt: new Date().toISOString(),
      },
    ],
  };
}

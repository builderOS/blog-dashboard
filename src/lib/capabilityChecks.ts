/**
 * Capability Checks
 *
 * This module defines the interface for read-only API checks.
 * Checks can update JSON or populate a cache.
 * They never run inside rendering logic.
 *
 * Currently: Interface only, not implemented.
 * Later: These become pluggable read-only checks.
 */

// ============================================================================
// Types
// ============================================================================

export interface CapabilityCheckResult {
  status: 'verified' | 'error'
  checkedAt: string // ISO timestamp
  notes?: string
}

// ============================================================================
// Check Functions (Intentionally Unimplemented)
// ============================================================================

/**
 * Check Google Search Console property for a domain.
 * Read-only: queries GSC API to verify property exists.
 */
export async function checkGoogleSearchConsole(
  _domain: string
): Promise<CapabilityCheckResult> {
  throw new Error('Not implemented')
}

/**
 * Check Google Analytics property for a domain.
 * Read-only: queries GA API to verify property exists.
 */
export async function checkGoogleAnalytics(
  _propertyId: string
): Promise<CapabilityCheckResult> {
  throw new Error('Not implemented')
}

/**
 * Check if a production site is reachable.
 * Read-only: performs HEAD request to verify site responds.
 */
export async function checkProductionSite(
  _url: string
): Promise<CapabilityCheckResult> {
  throw new Error('Not implemented')
}

/**
 * Check GitHub repository existence.
 * Read-only: queries GitHub API to verify repo exists.
 */
export async function checkGitHubRepo(
  _repoUrl: string
): Promise<CapabilityCheckResult> {
  throw new Error('Not implemented')
}

/**
 * Check Lovable project existence.
 * Read-only: queries Lovable API to verify project exists.
 */
export async function checkLovableProject(
  _projectUrl: string
): Promise<CapabilityCheckResult> {
  throw new Error('Not implemented')
}

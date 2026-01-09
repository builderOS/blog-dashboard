/**
 * Capability Checks
 *
 * Read-only detection of external platform presence.
 *
 * HARD RULES:
 * - Never runs automatically
 * - Never blocks rendering
 * - Never changes assets directly
 * - Only suggests updates
 *
 * Currently: Manual placeholders
 * Later: Can write to separate cache, generate suggested patches
 * But NEVER auto-mutate blogs.json
 */

export interface CapabilityCheckResult {
  detected: boolean
  checkedAt: string
  notes?: string
}

/**
 * Check if a production site is reachable.
 * Read-only: performs HEAD request to verify site responds.
 */
export async function checkProductionSite(url: string): Promise<CapabilityCheckResult> {
  try {
    await fetch(url, { method: 'HEAD', mode: 'no-cors' })
    return {
      detected: true,
      checkedAt: new Date().toISOString(),
      notes: 'Site responded',
    }
  } catch {
    return {
      detected: false,
      checkedAt: new Date().toISOString(),
      notes: 'Site unreachable or blocked by CORS',
    }
  }
}

/**
 * Check Google Search Console property existence.
 * Read-only: placeholder for manual verification.
 */
export async function checkGoogleSearchConsole(domain: string): Promise<CapabilityCheckResult> {
  // For now: manual placeholder
  // Future: Could query GSC API with proper auth
  return {
    detected: false,
    checkedAt: new Date().toISOString(),
    notes: `Manual verification required for ${domain}`,
  }
}

/**
 * Check Google Analytics property existence.
 * Read-only: placeholder for manual verification.
 */
export async function checkGoogleAnalytics(domain: string): Promise<CapabilityCheckResult> {
  // For now: manual placeholder
  // Future: Could check for GA tag on live site
  return {
    detected: false,
    checkedAt: new Date().toISOString(),
    notes: `Manual verification required for ${domain}`,
  }
}

/**
 * Run all capability checks for a blog.
 * Returns summary of what was detected.
 */
export async function runAllChecks(domain: string, productionUrl?: string): Promise<{
  productionSite: CapabilityCheckResult
  googleSearchConsole: CapabilityCheckResult
  googleAnalytics: CapabilityCheckResult
}> {
  const [productionSite, googleSearchConsole, googleAnalytics] = await Promise.all([
    productionUrl ? checkProductionSite(productionUrl) : Promise.resolve({
      detected: false,
      checkedAt: new Date().toISOString(),
      notes: 'No production URL configured',
    }),
    checkGoogleSearchConsole(domain),
    checkGoogleAnalytics(domain),
  ])

  return {
    productionSite,
    googleSearchConsole,
    googleAnalytics,
  }
}

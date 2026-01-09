/**
 * BlogDetail Page (Blog Overview)
 *
 * Answers one question: "Is this blog operationally complete, and what still matters?"
 *
 * This page is:
 * - A map
 * - A memory
 * - A launchpad (links only)
 *
 * It is NOT:
 * - A cockpit
 * - A CMS
 * - A growth tool
 *
 * If a button changes reality, it doesn't belong here.
 *
 * // This UI describes system state.
 * // It must never be required to change system state.
 */

import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useBlogsData } from '../../storage/useBlogsData'
import { deriveHealth } from '../../lib/deriveHealth'
import { runAllChecks, type CapabilityCheckResult } from '../../lib/capabilityChecks'
import AssetTable from '../components/AssetTable'
import HealthSummary from '../components/HealthSummary'
import StatusBadge from '../components/StatusBadge'

interface CheckResults {
  productionSite: CapabilityCheckResult
  googleSearchConsole: CapabilityCheckResult
  googleAnalytics: CapabilityCheckResult
}

export function BlogDetail() {
  const { blogId } = useParams<{ blogId: string }>()
  const { blogs, loading, error } = useBlogsData()
  const [checkResults, setCheckResults] = useState<CheckResults | null>(null)
  const [checking, setChecking] = useState(false)

  if (loading) {
    return <div className="empty-state">Loading...</div>
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Error loading data</h3>
        <p>{error}</p>
      </div>
    )
  }

  const blog = blogs.find(b => b.id === blogId)

  if (!blog) {
    return (
      <div className="empty-state">
        <Link to="/" className="back-link">← Back to blogs</Link>
        <h3>Blog not found</h3>
        <p>No blog with ID: {blogId}</p>
      </div>
    )
  }

  const health = deriveHealth(blog)

  // Get quick links for header (teleport links, not actions)
  const getAssetUrl = (type: string): string | undefined =>
    blog.assets.find(a => a.type === type)?.url

  const productionUrl = getAssetUrl('production_site')
  const githubUrl = getAssetUrl('github_repo')
  const lovableUrl = getAssetUrl('lovable_project')

  // Manual capability check handler
  const handleRunChecks = async () => {
    setChecking(true)
    try {
      const results = await runAllChecks(blog.domain, productionUrl)
      setCheckResults(results)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="blog-detail">
      <Link to="/" className="back-link">← Back to blogs</Link>

      {/* Header: Blog Identity Strip */}
      <div className="blog-detail-header">
        <div className="blog-identity">
          <h2>{blog.displayName}</h2>
          <div className="blog-meta">
            {productionUrl ? (
              <a href={productionUrl} target="_blank" rel="noopener noreferrer">
                {blog.domain}
              </a>
            ) : (
              <span>{blog.domain}</span>
            )}
            <StatusBadge status={blog.status} />
          </div>
        </div>
        <div className="blog-links">
          {/* These are teleport links, not actions */}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="header-link">
              GitHub
            </a>
          )}
          {lovableUrl && (
            <a href={lovableUrl} target="_blank" rel="noopener noreferrer" className="header-link">
              Lovable
            </a>
          )}
          {productionUrl && (
            <a href={productionUrl} target="_blank" rel="noopener noreferrer" className="header-link">
              Production
            </a>
          )}
        </div>
      </div>

      {/* Section 1: Overall Health Summary (derived, never stored) */}
      <HealthSummary health={health} />

      {/* Section 2: Internal Factory Assets */}
      <AssetTable
        assets={blog.assets}
        category="internal"
        subtitle="Does this blog exist in our system?"
      />

      {/* Section 3: External Platforms */}
      <AssetTable
        assets={blog.assets}
        category="external"
      />

      {/* Section 4: Distribution Readiness */}
      <AssetTable
        assets={blog.assets}
        category="distribution"
        subtitle="Nice to have, not blocking"
      />

      {/* Section 5: Manual Capability Checks */}
      <div className="capability-checks-section">
        <h3>Capability Checks</h3>
        <p className="section-subtitle">Read-only checks — does not modify any data</p>

        <button
          className="check-btn"
          onClick={handleRunChecks}
          disabled={checking}
        >
          {checking ? 'Running checks...' : 'Run read-only checks'}
        </button>

        {checkResults && (
          <div className="check-results">
            <div className="check-result">
              <span className="check-label">Production Site:</span>
              <span className={`check-status ${checkResults.productionSite.detected ? 'detected' : 'not-detected'}`}>
                {checkResults.productionSite.detected ? 'Reachable' : 'Not detected'}
              </span>
              {checkResults.productionSite.notes && (
                <span className="check-notes">{checkResults.productionSite.notes}</span>
              )}
            </div>
            <div className="check-result">
              <span className="check-label">Google Search Console:</span>
              <span className={`check-status ${checkResults.googleSearchConsole.detected ? 'detected' : 'not-detected'}`}>
                {checkResults.googleSearchConsole.detected ? 'Detected' : 'Not detected'}
              </span>
              {checkResults.googleSearchConsole.notes && (
                <span className="check-notes">{checkResults.googleSearchConsole.notes}</span>
              )}
            </div>
            <div className="check-result">
              <span className="check-label">Google Analytics:</span>
              <span className={`check-status ${checkResults.googleAnalytics.detected ? 'detected' : 'not-detected'}`}>
                {checkResults.googleAnalytics.detected ? 'Detected' : 'Not detected'}
              </span>
              {checkResults.googleAnalytics.notes && (
                <span className="check-notes">{checkResults.googleAnalytics.notes}</span>
              )}
            </div>
            <p className="check-timestamp">
              Checked at: {new Date(checkResults.productionSite.checkedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Section 6: Notes & Decisions */}
      {blog.notes && (
        <div className="asset-section">
          <h3>Notes & Decisions</h3>
          <div className="blog-notes">{blog.notes}</div>
        </div>
      )}
    </div>
  )
}

export default BlogDetail

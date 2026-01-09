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

import { Link, useParams } from 'react-router-dom'
import { useBlogsData } from '../../storage/useBlogsData'
import { deriveHealth } from '../../lib/deriveHealth'
import AssetTable from '../components/AssetTable'
import HealthSummary from '../components/HealthSummary'
import StatusBadge from '../components/StatusBadge'

export function BlogDetail() {
  const { blogId } = useParams<{ blogId: string }>()
  const { blogs, loading, error } = useBlogsData()

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

      {/* Section 5: Notes & Decisions */}
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

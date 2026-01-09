/**
 * BlogList Page
 *
 * Shows all blogs with health indicators.
 * This is a status board, not a command center.
 *
 * // This UI describes system state.
 * // It must never be required to change system state.
 */

import { useNavigate } from 'react-router-dom'
import { useBlogsData } from '../../storage/useBlogsData'
import { deriveHealth } from '../../lib/deriveHealth'

const HEALTH_INDICATORS: Record<string, string> = {
  healthy: 'healthy',
  incomplete: 'warning',
  risk: 'critical',
}

export function BlogList() {
  const { blogs, loading, error } = useBlogsData()
  const navigate = useNavigate()

  if (loading) {
    return <div className="empty-state">Loading blogs...</div>
  }

  if (error) {
    return (
      <div className="empty-state">
        <h3>Error loading data</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="empty-state">
        <h3>No blogs configured</h3>
        <p>Add blogs to data/blogs.json to get started.</p>
      </div>
    )
  }

  return (
    <div className="blog-list">
      {blogs.map(blog => {
        const health = deriveHealth(blog)
        const indicatorClass = HEALTH_INDICATORS[health.level] || 'unknown'

        return (
          <div
            key={blog.id}
            className="blog-card"
            onClick={() => navigate(`/blog/${encodeURIComponent(blog.id)}`)}
          >
            <div className={`health-indicator ${indicatorClass}`} />
            <div className="blog-info">
              <div className="blog-name">{blog.displayName}</div>
              <div className="blog-domain">{blog.domain}</div>
            </div>
            <div className="blog-stats">
              {health.missing.critical > 0 && (
                <span style={{ color: 'var(--color-critical)' }}>
                  {health.missing.critical} critical
                </span>
              )}
              {health.missing.important > 0 && (
                <span style={{ color: 'var(--color-warning)' }}>
                  {health.missing.important} important
                </span>
              )}
              {health.missing.critical === 0 && health.missing.important === 0 && (
                <span style={{ color: 'var(--color-healthy)' }}>Complete</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BlogList

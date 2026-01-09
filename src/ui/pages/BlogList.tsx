/**
 * BlogList Page
 *
 * Shows all blogs with health indicators.
 * This is a status board, not a command center.
 *
 * // Sorting and filtering are observational only.
 * // They must never mutate blog or asset state.
 * // Navigation links out to tools; no actions are performed here.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBlogsData } from '../../storage/useBlogsData'
import { deriveHealth, type HealthLevel } from '../../lib/deriveHealth'
import { healthRank } from '../../lib/healthRank'
import { buildSnapshot, snapshotToCSV } from '../../lib/buildSnapshot'
import type { BlogStatus } from '../../schema'

const HEALTH_INDICATORS: Record<HealthLevel, string> = {
  healthy: 'healthy',
  incomplete: 'warning',
  risk: 'critical',
}

type StatusFilter = 'all' | BlogStatus
type HealthFilter = 'all' | HealthLevel

export function BlogList() {
  const { blogs, loading, error } = useBlogsData()
  const navigate = useNavigate()

  // Filter state (UI only, not persisted)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [healthFilter, setHealthFilter] = useState<HealthFilter>('all')
  const [domainQuery, setDomainQuery] = useState('')

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

  // Derive health and apply filters
  const blogsWithHealth = blogs
    .map(blog => ({
      blog,
      health: deriveHealth(blog),
    }))
    .filter(({ blog, health }) => {
      if (statusFilter !== 'all' && blog.status !== statusFilter) return false
      if (healthFilter !== 'all' && health.level !== healthFilter) return false
      if (domainQuery && !blog.domain.toLowerCase().includes(domainQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      // Primary: health severity (risk first)
      const healthDiff = healthRank(a.health.level) - healthRank(b.health.level)
      if (healthDiff !== 0) return healthDiff
      // Secondary: alphabetical
      return a.blog.displayName.localeCompare(b.blog.displayName)
    })

  // Preset filter handlers
  const applyPreset = (preset: 'riskOnly' | 'activeOnly' | 'clear') => {
    switch (preset) {
      case 'riskOnly':
        setStatusFilter('all')
        setHealthFilter('risk')
        setDomainQuery('')
        break
      case 'activeOnly':
        setStatusFilter('active')
        setHealthFilter('all')
        setDomainQuery('')
        break
      case 'clear':
        setStatusFilter('all')
        setHealthFilter('all')
        setDomainQuery('')
        break
    }
  }

  // Export handlers
  const exportJSON = () => {
    const snapshot = buildSnapshot(blogs)
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `blog-dashboard-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const snapshot = buildSnapshot(blogs)
    const csv = snapshotToCSV(snapshot)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `blog-dashboard-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="blog-list-page">
      {/* Filter presets */}
      <div className="filter-presets">
        <button className="filter-preset-btn" onClick={() => applyPreset('riskOnly')}>
          Show Risk Only
        </button>
        <button className="filter-preset-btn" onClick={() => applyPreset('activeOnly')}>
          Active Blogs
        </button>
        <button className="filter-preset-btn" onClick={() => applyPreset('clear')}>
          Clear Filters
        </button>
        <div className="filter-spacer" />
        <button className="export-btn" onClick={exportJSON}>
          Export JSON
        </button>
        <button className="export-btn" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusFilter)}
          className="filter-select"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={healthFilter}
          onChange={e => setHealthFilter(e.target.value as HealthFilter)}
          className="filter-select"
        >
          <option value="all">All health</option>
          <option value="risk">Risk</option>
          <option value="incomplete">Incomplete</option>
          <option value="healthy">Healthy</option>
        </select>

        <input
          type="text"
          placeholder="Filter by domain..."
          value={domainQuery}
          onChange={e => setDomainQuery(e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Results count */}
      <div className="results-count">
        Showing {blogsWithHealth.length} of {blogs.length} blogs
      </div>

      {/* Blog list */}
      <div className="blog-list">
        {blogsWithHealth.map(({ blog, health }) => {
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

      {blogsWithHealth.length === 0 && (
        <div className="empty-state">
          <p>No blogs match current filters</p>
        </div>
      )}
    </div>
  )
}

export default BlogList

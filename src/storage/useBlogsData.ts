/**
 * useBlogsData Hook
 *
 * Loads blog data from the canonical JSON source.
 * This is read-only. No mutations to upstream truth.
 */

import { useState, useEffect } from 'react'
import type { Blog, BlogsData } from '../schema'

// In development, load from JSON file
// In production, this could be an API endpoint
const DATA_URL = '/data/blogs.json'

interface UseBlogsDataResult {
  blogs: Blog[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useBlogsData(): UseBlogsDataResult {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(DATA_URL)
      if (!response.ok) {
        throw new Error(`Failed to load blogs: ${response.status}`)
      }
      const data: BlogsData = await response.json()
      setBlogs(data.blogs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    blogs,
    loading,
    error,
    reload: loadData,
  }
}

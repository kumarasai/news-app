import { useState, useEffect, useCallback } from 'react'
import { fetchTopHeadlines, searchNews, getMockArticles } from '../utils/api'

const DEMO_MODE = !import.meta.env.VITE_NEWS_API_KEY 
// || import.meta.env.VITE_NEWS_API_KEY === 'demo'

export function useNews({ category, query, pageSize = 12 }) {
  const [articles, setArticles] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchArticles = useCallback(async (pageNum, reset = false) => {
    setLoading(true)
    setError(null)
    try {
      let result
      if (DEMO_MODE) {
        // Simulate API delay
        await new Promise(r => setTimeout(r, 600))
        const mock = getMockArticles(pageSize * 3)
        const start = (pageNum - 1) * pageSize
        result = {
          articles: mock.slice(start, start + pageSize),
          totalResults: mock.length,
        }
      } else if (query) {
        result = await searchNews({ query, page: pageNum, pageSize })
      } else {
        result = await fetchTopHeadlines({ category, page: pageNum, pageSize })
      }

      const newArticles = result.articles.filter(a => a.title && a.title !== '[Removed]')
      setArticles(prev => reset ? newArticles : [...prev, ...newArticles])
      setHasMore(newArticles.length === pageSize)
    } catch (err) {
      setError(err.message || 'Failed to fetch news')
    } finally {
      setLoading(false)
    }
  }, [category, query, pageSize])

  useEffect(() => {
    setArticles([])
    setPage(1)
    setHasMore(true)
    fetchArticles(1, true)
  }, [category, query])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchArticles(next)
  }

  return { articles, loading, error, hasMore, loadMore }
}

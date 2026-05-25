import { useState, useEffect, useRef, useCallback } from 'react'
import { LayoutGrid, List, AlertCircle } from 'lucide-react'
import Navbar from './components/Navbar'
import ArticleCard, { SkeletonCard } from './components/ArticleCard'
import ReadingList from './components/ReadingList'
import { ThemeProvider } from './context/ThemeContext'
import { ReadingListProvider } from './context/ReadingListContext'
import { useNews } from './hooks/useNews'

function NewsGrid({ category, query, view }) {
  const { articles, loading, error, hasMore, loadMore } = useNews({ category, query })
  const observerRef = useRef(null)
  const loadMoreRef = useRef(null)

  const handleObserver = useCallback((entries) => {
    const [entry] = entries
    if (entry.isIntersecting && hasMore && !loading) loadMore()
  }, [hasMore, loading, loadMore])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current)
    return () => observerRef.current?.disconnect()
  }, [handleObserver])

  if (error) return (
    <div className="flex flex-col items-center py-20 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <p className="font-medium text-ink-700 dark:text-gray-300 mb-2">Failed to load articles</p>
      <p className="text-sm text-ink-400 dark:text-gray-500">{error}</p>
    </div>
  )

  const skeletons = Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} view={view} />)

  return (
    <div>
      <div className={view === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
        : 'flex flex-col gap-3'
      }>
        {articles.map((article, i) => (
          <ArticleCard key={`${article.url}-${i}`} article={article} view={view} />
        ))}
        {loading && skeletons}
      </div>
      <div ref={loadMoreRef} className="h-10 mt-4" />
      {!hasMore && articles.length > 0 && (
        <p className="text-center text-sm text-ink-400 dark:text-gray-500 py-8">
          You've reached the end · {articles.length} articles loaded
        </p>
      )}
    </div>
  )
}

function AppInner() {
  const [category, setCategory] = useState('general')
  const [query, setQuery] = useState('')
  const [view, setView] = useState(() => localStorage.getItem('newsflow-view') || 'grid')
  const [showReadingList, setShowReadingList] = useState(false)
  const [searchLabel, setSearchLabel] = useState('')

  const handleView = (v) => { setView(v); localStorage.setItem('newsflow-view', v) }
  const handleSearch = (q) => { setQuery(q); setSearchLabel(q); if (q) setShowReadingList(false) }
  const handleCategory = (cat) => { setCategory(cat); setQuery(''); setSearchLabel(''); setShowReadingList(false) }

  const CATEGORY_LABELS = {
    general: 'Top Stories', technology: 'Technology', business: 'Business',
    sports: 'Sports', health: 'Health', science: 'Science', entertainment: 'Entertainment',
  }

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar
        activeCategory={category}
        onCategory={handleCategory}
        onSearch={handleSearch}
        onShowReadingList={() => setShowReadingList(r => !r)}
        showReadingList={showReadingList}
      />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {showReadingList ? (
          <ReadingList onClose={() => setShowReadingList(false)} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
                  {searchLabel ? `Results for "${searchLabel}"` : CATEGORY_LABELS[category]}
                </h1>
                <p className="text-sm text-ink-400 dark:text-gray-500 mt-0.5">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-ink-200 dark:border-gray-800 rounded-lg p-1">
                <button onClick={() => handleView('grid')} className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-red-700 text-white' : 'text-ink-400 dark:text-gray-500 hover:text-ink-700 dark:hover:text-gray-300'}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => handleView('list')} className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-red-700 text-white' : 'text-ink-400 dark:text-gray-500 hover:text-ink-700 dark:hover:text-gray-300'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            <NewsGrid key={`${category}-${query}`} category={category} query={query} view={view} />
          </>
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ReadingListProvider>
        <AppInner />
      </ReadingListProvider>
    </ThemeProvider>
  )
}

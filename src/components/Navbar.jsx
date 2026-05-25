import { useState } from 'react'
import { Sun, Moon, Bookmark, Search, X, Newspaper, Menu } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useReadingList } from '../context/ReadingListContext'

const CATEGORIES = [
  { id: 'general', label: 'Top Stories' },
  { id: 'technology', label: 'Tech' },
  { id: 'business', label: 'Business' },
  { id: 'sports', label: 'Sports' },
  { id: 'health', label: 'Health' },
  { id: 'science', label: 'Science' },
  { id: 'entertainment', label: 'Entertainment' },
]

export default function Navbar({ activeCategory, onCategory, onSearch, onShowReadingList, showReadingList }) {
  const { dark, toggle } = useTheme()
  const { readingList } = useReadingList()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      onSearch(searchVal.trim())
      setSearchOpen(false)
    }
  }

  const clearSearch = () => {
    setSearchVal('')
    onSearch('')
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-ink-50/95 dark:bg-gray-950/95 backdrop-blur border-b border-ink-200 dark:border-gray-800">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Newspaper className="w-6 h-6 text-red-700 dark:text-red-500" />
          <span className="font-display text-xl font-bold text-ink-900 dark:text-white tracking-tight">
            News<span className="text-red-700 dark:text-red-500">Flow</span>
          </span>
        </div>

        {/* Search bar */}
        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
            <input
              autoFocus
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 bg-white dark:bg-gray-900 border border-ink-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-600 dark:text-white"
            />
            <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors">
              Search
            </button>
            <button type="button" onClick={clearSearch} className="p-2 text-ink-500 hover:text-ink-900 dark:text-gray-400 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-gray-800 transition-colors text-ink-600 dark:text-gray-400">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onShowReadingList}
              className={`relative p-2 rounded-lg transition-colors ${showReadingList ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'hover:bg-ink-100 dark:hover:bg-gray-800 text-ink-600 dark:text-gray-400'}`}
            >
              <Bookmark className="w-5 h-5" />
              {readingList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-700 text-white text-xs rounded-full flex items-center justify-center">
                  {readingList.length}
                </span>
              )}
            </button>
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-gray-800 transition-colors text-ink-600 dark:text-gray-400">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setMenuOpen(m => !m)} className="md:hidden p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-gray-800 text-ink-600 dark:text-gray-400">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Category nav */}
      <nav className={`max-w-7xl mx-auto px-4 pb-2 overflow-x-auto ${menuOpen ? 'block' : 'hidden md:block'}`}>
        <div className="flex gap-1 min-w-max">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { onCategory(cat.id); setMenuOpen(false) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id && !showReadingList
                  ? 'bg-red-700 text-white'
                  : 'text-ink-600 dark:text-gray-400 hover:bg-ink-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}

import { Bookmark, BookmarkCheck, Share2, ExternalLink, Clock } from 'lucide-react'
import { useReadingList } from '../context/ReadingListContext'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function ArticleCard({ article, view }) {
  const { add, remove, isSaved } = useReadingList()
  const saved = isSaved(article.url)

  const handleSave = (e) => {
    e.preventDefault()
    saved ? remove(article.url) : add(article)
  }

  const handleShare = async (e) => {
    e.preventDefault()
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url: article.url })
      } else {
        await navigator.clipboard.writeText(article.url)
        alert('Link copied to clipboard!')
      }
    } catch {}
  }

  if (view === 'list') {
    return (
      <article className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-ink-100 dark:border-gray-800 hover:border-ink-300 dark:hover:border-gray-700 transition-all duration-200 animate-[fadeIn_0.3s_ease-out]">
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt=""
            className="w-28 h-20 object-cover rounded-lg flex-shrink-0"
            onError={e => e.target.style.display = 'none'}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wide">
              {article.source?.name}
            </span>
            <span className="text-ink-300 dark:text-gray-600">·</span>
            <span className="text-xs text-ink-400 dark:text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />{timeAgo(article.publishedAt)}
            </span>
          </div>
          <h2 className="font-display font-semibold text-ink-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1">
            {article.title}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <button onClick={handleSave} className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-red-700 dark:text-red-400' : 'text-ink-400 hover:text-ink-700 dark:text-gray-500 dark:hover:text-gray-300'}`}>
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button onClick={handleShare} className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors ml-auto">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-ink-100 dark:border-gray-800 hover:border-ink-300 dark:hover:border-gray-700 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 animate-[slideUp_0.3s_ease-out] flex flex-col">
      <div className="relative">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt=""
            className="w-full h-44 object-cover"
            onError={e => { e.target.parentElement.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-44 bg-ink-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-ink-300 dark:text-gray-600 text-4xl">📰</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-sm transition-all ${saved ? 'bg-red-700 text-white' : 'bg-white/80 dark:bg-gray-900/80 text-ink-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900'}`}
          >
            {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-ink-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">
            {article.source?.name}
          </span>
          <span className="text-ink-200 dark:text-gray-700">·</span>
          <span className="text-xs text-ink-400 dark:text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />{timeAgo(article.publishedAt)}
          </span>
        </div>
        <h2 className="font-display font-semibold text-ink-900 dark:text-white leading-snug line-clamp-2 mb-2 flex-1">
          {article.title}
        </h2>
        {article.description && (
          <p className="text-sm text-ink-500 dark:text-gray-400 line-clamp-2 mb-4">
            {article.description}
          </p>
        )}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors mt-auto"
        >
          Read full story <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  )
}

export function SkeletonCard({ view }) {
  if (view === 'list') {
    return (
      <div className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-ink-100 dark:border-gray-800">
        <div className="w-28 h-20 skeleton rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <div className="skeleton h-3 w-24 rounded mb-2" />
          <div className="skeleton h-4 w-full rounded mb-1" />
          <div className="skeleton h-4 w-3/4 rounded" />
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-ink-100 dark:border-gray-800">
      <div className="skeleton w-full h-44" />
      <div className="p-4">
        <div className="skeleton h-3 w-24 rounded mb-3" />
        <div className="skeleton h-4 w-full rounded mb-2" />
        <div className="skeleton h-4 w-5/6 rounded mb-2" />
        <div className="skeleton h-3 w-full rounded mb-1 mt-3" />
        <div className="skeleton h-3 w-4/5 rounded" />
      </div>
    </div>
  )
}

export default ArticleCard

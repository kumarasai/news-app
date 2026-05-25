import { Bookmark, X, ExternalLink, Trash2 } from 'lucide-react'
import { useReadingList } from '../context/ReadingListContext'

export default function ReadingList({ onClose }) {
  const { readingList, remove } = useReadingList()

  return (
    <div className="animate-[fadeIn_0.2s_ease-out]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-red-700 dark:text-red-400" />
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white">
            Reading List
          </h2>
          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full">
            {readingList.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-gray-800 text-ink-500 dark:text-gray-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {readingList.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 text-ink-200 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-ink-500 dark:text-gray-400 font-medium">No saved articles yet</p>
          <p className="text-sm text-ink-400 dark:text-gray-500 mt-1">Tap the bookmark icon on any article to save it here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {readingList.map(article => (
            <div
              key={article.url}
              className="flex gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl border border-ink-100 dark:border-gray-800 group hover:border-ink-300 dark:hover:border-gray-700 transition-all"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt=""
                  className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                  onError={e => e.target.style.display = 'none'}
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-red-700 dark:text-red-400 block mb-1">
                  {article.source?.name}
                </span>
                <h3 className="text-sm font-semibold text-ink-900 dark:text-white leading-snug line-clamp-2">
                  {article.title}
                </h3>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => remove(article.url)}
                  className="p-1.5 rounded-lg text-ink-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

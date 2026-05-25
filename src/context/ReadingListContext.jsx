import { createContext, useContext, useState, useEffect } from 'react'

const ReadingListContext = createContext()

export function ReadingListProvider({ children }) {
  const [readingList, setReadingList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('newsflow-reading-list')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('newsflow-reading-list', JSON.stringify(readingList))
  }, [readingList])

  const add = (article) => {
    setReadingList(prev => {
      if (prev.find(a => a.url === article.url)) return prev
      return [article, ...prev]
    })
  }

  const remove = (url) => {
    setReadingList(prev => prev.filter(a => a.url !== url))
  }

  const isSaved = (url) => readingList.some(a => a.url === url)

  return (
    <ReadingListContext.Provider value={{ readingList, add, remove, isSaved }}>
      {children}
    </ReadingListContext.Provider>
  )
}

export const useReadingList = () => useContext(ReadingListContext)

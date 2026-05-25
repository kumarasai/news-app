import axios from 'axios'

// NOTE: Replace with your NewsAPI key from https://newsapi.org
// For demo/development, using a proxy or mock data if key not provided
const API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo'
const BASE_URL = 'https://newsapi.org/v2'

const api = axios.create({
  baseURL: BASE_URL,
  params: { apiKey: API_KEY },
})

export const fetchTopHeadlines = async ({ category = 'general', page = 1, pageSize = 12 }) => {
  const { data } = await api.get('/top-headlines', {
    params: { category, country: 'us', page, pageSize },
  })
  return data
}

export const searchNews = async ({ query, page = 1, pageSize = 12 }) => {
  const { data } = await api.get('/everything', {
    params: {
      q: query,
      page,
      pageSize,
      sortBy: 'publishedAt',
      language: 'en',
    },
  })
  return data
}

// Mock data for demo when no API key is provided
export const getMockArticles = (count = 12) => {
  const categories = ['Technology', 'Business', 'Sports', 'Health', 'Science']
  const sources = ['BBC News', 'Reuters', 'The Guardian', 'CNN', 'AP News', 'Bloomberg']
  const images = [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
    'https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=800',
  ]

  const headlines = [
    'Global Markets Rally as Inflation Data Shows Signs of Easing',
    'Tech Giants Announce Major AI Partnership to Transform Healthcare',
    'Scientists Discover New Species of Deep-Sea Creatures Off Pacific Coast',
    'Electric Vehicle Sales Surpass Record Highs in Q1 2026',
    'Championship Finals: Underdogs Stun Favorites in Historic Upset',
    'New Climate Study Reveals Accelerated Arctic Ice Melt',
    'Startup Raises $500M to Revolutionize Renewable Energy Storage',
    'Astronomers Detect Unusual Signal from Distant Galaxy',
    'Major Breakthrough in Alzheimer\'s Treatment Shows Promise in Trials',
    'Global Leaders Convene for Emergency Summit on Cybersecurity',
    'Record-Breaking Heatwave Prompts Emergency Measures Across Europe',
    'Space Agency Confirms Plans for Permanent Moon Base by 2030',
  ]

  return Array.from({ length: count }, (_, i) => ({
    url: `https://example.com/article-${i}`,
    title: headlines[i % headlines.length],
    description: 'This is a sample article description that gives readers a brief overview of what the article covers. The full story contains more details and analysis from experts in the field.',
    urlToImage: images[i % images.length],
    publishedAt: new Date(Date.now() - i * 3600000 * 2).toISOString(),
    source: { name: sources[i % sources.length] },
    author: 'Staff Reporter',
    category: categories[i % categories.length],
  }))
}

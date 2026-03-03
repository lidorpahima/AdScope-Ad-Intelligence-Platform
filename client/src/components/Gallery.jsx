import { useState } from 'react'
import GalleryItem from './GalleryItem'
import CompanyModal from './CompanyModal'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const Gallery = () => {
  const [items, setItems] = useState([])
  const [fullCompanyData, setFullCompanyData] = useState({})
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = new URL(`${API_URL}/api/gallery/search`)
      url.searchParams.append('query', searchQuery)
      
      const response = await fetch(url.toString())
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results')
      }

      if (data.success) {
        setItems(data.items)
        // Store full company data for modal
        const companyMap = {}
        data.searchResults.forEach((company) => {
          companyMap[company.page_id] = company
        })
        setFullCompanyData(companyMap)
      } else {
        setError('Failed to fetch results')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(err.message || 'Failed to search companies')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gallery</h1>
        <p className="text-gray-600 mb-6">Search for companies to view their ads</p>
        
        <form onSubmit={handleSearch} className="max-w-md">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for companies..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </header>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p>No results yet. Search for a company to see their ads.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <GalleryItem
              key={item.id}
              item={item}
              onClick={() => setSelectedCompany(fullCompanyData[item.id])}
            />
          ))}
        </div>
      )}

      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  )
}

export default Gallery

import { useState } from "react";
import GalleryItem from "./GalleryItem";
import AdsModal from "./AdsModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const Gallery = () => {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageId, setPageId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAd, setSelectedAd] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim() && !pageId.trim()) {
      setError("Please enter a search query or page ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL(`${API_URL}/api/ads/search`);
      if (searchQuery.trim()) {
        url.searchParams.append("q", searchQuery);
      }
      if (pageId.trim()) {
        url.searchParams.append("page_id", pageId);
      }

      console.log("Fetching from:", url.toString());
      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(
          errorData.error || `HTTP ${response.status}: Failed to fetch results`,
        );
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        const adsArray = Array.isArray(data.ads) ? data.ads : [];
        setAds(adsArray);
        setSearchInfo(data.search_information);
      } else {
        setError("Failed to fetch results");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search ads");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Ads Gallery</h1>
        <p className="text-gray-600 mb-6">
          Search for ads from Meta Ad Library
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword (e.g., 'nike air')..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || (!searchQuery.trim() && !pageId.trim())}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Searching..." : "Search Ads"}
            </button>
          </div>
        </form>
      </header>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {(!ads || ads.length === 0) && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p>No results yet. Search for ads to see them here.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {ads && ads.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ads.map((ad, index) => (
              <GalleryItem
                key={ad.ad_archive_id || index}
                ad={ad}
                onClick={() => setSelectedAd(ad)}
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center">
            Showing only the first {ads.length.toLocaleString()} results out of{" "}
            {searchInfo?.total_results?.toLocaleString() || "N/A"} to preserve
            API credits.
          </p>
        </>
      )}

      {selectedAd && (
        <AdsModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
      )}
    </div>
  );
};

export default Gallery;

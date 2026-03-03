const AdsModal = ({ ad, onClose }) => {
  if (!ad) return null

  const snapshot = ad.snapshot || {}
  const pageName = snapshot.page_name || ad.page_name || 'Unknown'
  const adText = snapshot.body?.text || ''
  const images = snapshot.images || snapshot.cards || []

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{pageName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Page Info */}
          {snapshot.page_profile_picture_url && (
            <div className="flex items-center gap-4 mb-6">
              <img
                src={snapshot.page_profile_picture_url}
                alt={pageName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{pageName}</h3>
                {snapshot.page_like_count && (
                  <p className="text-sm text-gray-600">
                    {snapshot.page_like_count.toLocaleString()} likes
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Ad Text */}
          {adText && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Ad Text</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{adText}</p>
            </div>
          )}

          {/* Images */}
          {images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Images ({images.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.resized_image_url || image.original_image_url}
                      alt={`Ad image ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                    {image.title && (
                      <p className="mt-2 text-sm font-medium">{image.title}</p>
                    )}
                    {image.body && (
                      <p className="mt-1 text-sm text-gray-600">{image.body}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ad Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Ad Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ad.ad_archive_id && (
                <div>
                  <p className="text-sm text-gray-500">Ad Archive ID</p>
                  <p className="font-medium">{ad.ad_archive_id}</p>
                </div>
              )}
              {ad.page_id && (
                <div>
                  <p className="text-sm text-gray-500">Page ID</p>
                  <p className="font-medium">{ad.page_id}</p>
                </div>
              )}
              {ad.is_active !== undefined && (
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    {ad.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              )}
              {ad.start_date && (
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">
                    {new Date(ad.start_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {ad.end_date && (
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium">
                    {new Date(ad.end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {ad.publisher_platform && Array.isArray(ad.publisher_platform) && (
                <div>
                  <p className="text-sm text-gray-500">Platforms</p>
                  <p className="font-medium">{ad.publisher_platform.join(', ')}</p>
                </div>
              )}
              {ad.categories && Array.isArray(ad.categories) && (
                <div>
                  <p className="text-sm text-gray-500">Categories</p>
                  <p className="font-medium">{ad.categories.join(', ')}</p>
                </div>
              )}
              {snapshot.display_format && (
                <div>
                  <p className="text-sm text-gray-500">Display Format</p>
                  <p className="font-medium">{snapshot.display_format}</p>
                </div>
              )}
              {snapshot.cta_text && (
                <div>
                  <p className="text-sm text-gray-500">Call to Action</p>
                  <p className="font-medium">{snapshot.cta_text}</p>
                </div>
              )}
              {snapshot.link_url && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Link URL</p>
                  <a
                    href={snapshot.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline break-all"
                  >
                    {snapshot.link_url}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Debug: Show all available data */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Show all available data (debug)
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(ad, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}

export default AdsModal

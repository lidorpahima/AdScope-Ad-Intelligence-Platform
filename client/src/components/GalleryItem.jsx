const GalleryItem = ({ ad, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  // Get the first image from the ad
  const getImageUrl = () => {
    if (ad.snapshot?.images && ad.snapshot.images.length > 0) {
      return ad.snapshot.images[0].resized_image_url || ad.snapshot.images[0].original_image_url
    }
    if (ad.snapshot?.cards && ad.snapshot.cards.length > 0) {
      return ad.snapshot.cards[0].resized_image_url || ad.snapshot.cards[0].original_image_url
    }
    if (ad.snapshot?.page_profile_picture_url) {
      return ad.snapshot.page_profile_picture_url
    }
    return null
  }

  const imageUrl = getImageUrl()
  const pageName = ad.snapshot?.page_name || ad.page_name || 'Unknown'
  const adText = ad.snapshot?.body?.text || ''

  return (
    <div
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white"
      onClick={handleClick}
    >
      {imageUrl ? (
        <div className="aspect-square relative">
          <img
            src={imageUrl}
            alt={pageName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="aspect-square bg-gray-200 flex items-center justify-center">
          <p className="text-gray-400 text-sm">No Image</p>
        </div>
      )}
      
      <div className="p-4">
        <p className="font-medium text-sm text-gray-900 mb-1">{pageName}</p>
        {adText && (
          <p className="text-xs text-gray-600 line-clamp-2">{adText}</p>
        )}
        {ad.is_active !== undefined && (
          <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
            ad.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {ad.is_active ? 'Active' : 'Inactive'}
          </span>
        )}
      </div>
    </div>
  )
}

export default GalleryItem

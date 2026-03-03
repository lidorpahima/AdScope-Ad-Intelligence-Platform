const GalleryItem = ({ item }) => {
  const handleClick = () => {
    // Future: Open modal or navigate to detail view
    console.log('Item clicked:', item.id)
  }

  return (
    <div
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white"
      onClick={handleClick}
    >
      {item.type === 'image' ? (
        <div className="aspect-square relative">
          <img
            src={item.url}
            alt={item.title || 'Gallery item'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="aspect-square relative bg-gray-900 flex items-center justify-center">
          <video
            src={item.url}
            className="w-full h-full object-cover"
            muted
            loop
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            Video
          </div>
        </div>
      )}
      
      {item.title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white font-medium text-sm">{item.title}</p>
        </div>
      )}
    </div>
  )
}

export default GalleryItem

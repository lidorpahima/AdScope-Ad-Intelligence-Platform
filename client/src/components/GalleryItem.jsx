const GalleryItem = ({ ad, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Get the first image from the ad
  const getImageUrl = () => {
    if (ad.snapshot?.images && ad.snapshot.images.length > 0) {
      return (
        ad.snapshot.images[0].resized_image_url ||
        ad.snapshot.images[0].original_image_url
      );
    }
    if (ad.snapshot?.cards && ad.snapshot.cards.length > 0) {
      return (
        ad.snapshot.cards[0].resized_image_url ||
        ad.snapshot.cards[0].original_image_url
      );
    }
    if (ad.snapshot?.page_profile_picture_url) {
      return ad.snapshot.page_profile_picture_url;
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const pageName = ad.snapshot?.page_name || ad.page_name || "Unknown";
  const adText = ad.snapshot?.body?.text || "";

  const startDate = ad.start_date ? new Date(ad.start_date) : null;
  const platformsArray = Array.isArray(ad.publisher_platform)
    ? ad.publisher_platform
    : [];
  const impressionsIndex = ad.impressions_with_index?.impressions_index;
  const hasImpressionsIndex =
    typeof impressionsIndex === "number" && impressionsIndex >= 0;
  const performanceLabel = hasImpressionsIndex
    ? `Impressions index: ${impressionsIndex}`
    : null;

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

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
          {startDate && (
            <span className="inline-flex items-center gap-1">
              <svg
                className="w-3 h-3 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1ZM4 8h12v7H4V8Z" />
              </svg>
              <span>{startDate.toLocaleDateString()}</span>
            </span>
          )}

          {platformsArray.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              {platformsArray.map((platform) => {
                const p = platform.toUpperCase();
                let label = p;
                let icon = null;

                if (p === "FACEBOOK") {
                  label = "Facebook";
                  icon = (
                    <svg
                      className="w-3 h-3 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M13 4h2.5a1 1 0 1 0 0-2H13a4 4 0 0 0-4 4v2H7a1 1 0 0 0 0 2h2v8a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-8H16a1 1 0 0 0 .96-.73l.5-2a1 1 0 0 0-.96-1.27H13V6a2 2 0 0 1 2-2Z" />
                    </svg>
                  );
                } else if (p === "INSTAGRAM") {
                  label = "Instagram";
                  icon = (
                    <svg
                      className="w-3 h-3 text-pink-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <rect x="4" y="4" width="16" height="16" rx="5" />
                      <circle cx="12" cy="12" r="3.5" />
                      <circle cx="17" cy="7" r="1" />
                    </svg>
                  );
                } else if (p === "AUDIENCE_NETWORK") {
                  label = "Audience Network";
                  icon = (
                    <svg
                      className="w-3 h-3 text-purple-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <path d="M4 12h4M16 12h4M12 4v4M12 16v4" />
                    </svg>
                  );
                } else if (p === "MESSENGER") {
                  label = "Messenger";
                  icon = (
                    <svg
                      className="w-3 h-3 text-sky-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <path d="M12 3C7.58 3 4 6.24 4 10.5c0 2.32 1.13 4.37 2.97 5.7L7 21l3.13-1.72c.6.1 1.2.16 1.87.16 4.42 0 8-3.24 8-7.5S16.42 3 12 3Z" />
                      <path d="m8.5 11.5 2.25-2.25L13 11.5l2.25-2.25" />
                    </svg>
                  );
                } else {
                  icon = (
                    <svg
                      className="w-3 h-3 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10 2a4 4 0 0 0-4 4v1H5a3 3 0 0 0 0 6h1v1a4 4 0 1 0 8 0v-1h1a3 3 0 0 0 0-6h-1V6a4 4 0 0 0-4-4Z" />
                    </svg>
                  );
                }

                return (
                  <span
                    key={platform}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200"
                  >
                    {icon}
                    <span>{label}</span>
                  </span>
                );
              })}
            </div>
          )}

          {performanceLabel ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              <svg
                className="w-3 h-3 text-indigo-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 3a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V5h12a1 1 0 1 0 0-2H3Zm4.293 7.707 2 2a1 1 0 0 0 1.414 0L13 10.414l2.293 2.293a1 1 0 0 0 1.414-1.414l-3-3a1 1 0 0 0-1.414 0L10 10.586 8.707 9.293a1 1 0 0 0-1.414 1.414Z" />
              </svg>
              <span>{performanceLabel}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 italic">
              <svg
                className="w-3 h-3"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M10 3.5A6.5 6.5 0 1 0 16.5 10M10 6v5m0 3.5h.01" />
              </svg>
              <span>impressions not found</span>
            </span>
          )}
        </div>

        {ad.is_active !== undefined && (
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
              ad.is_active
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {ad.is_active ? "Active" : "Inactive"}
          </span>
        )}
      </div>
    </div>
  );
};

export default GalleryItem;

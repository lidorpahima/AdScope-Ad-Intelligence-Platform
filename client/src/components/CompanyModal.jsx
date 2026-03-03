const CompanyModal = ({ company, onClose }) => {
  if (!company) return null

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
          <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <img
                src={company.image_uri}
                alt={company.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{company.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Page ID</p>
                  <p className="font-medium">{company.page_id}</p>
                </div>
                {company.likes && (
                  <div>
                    <p className="text-sm text-gray-500">Likes</p>
                    <p className="font-medium">
                      {company.likes.toLocaleString()}
                    </p>
                  </div>
                )}
                {company.ig_followers && (
                  <div>
                    <p className="text-sm text-gray-500">Instagram Followers</p>
                    <p className="font-medium">
                      {company.ig_followers.toLocaleString()}
                    </p>
                  </div>
                )}
                {company.verification && (
                  <div>
                    <p className="text-sm text-gray-500">Verification</p>
                    <p className="font-medium">
                      {company.verification === 'BLUE_VERIFIED'
                        ? '✓ Verified'
                        : 'Not Verified'}
                    </p>
                  </div>
                )}
                {company.ig_username && (
                  <div>
                    <p className="text-sm text-gray-500">Instagram</p>
                    <p className="font-medium">@{company.ig_username}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-4">Ads</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
              <p>Ads will be displayed here soon</p>
              <p className="text-sm mt-2">
                This feature is coming soon. We'll fetch and display ads for this
                company.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyModal

import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const AdsModal = ({ ad, onClose, region = "world" }) => {
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!ad?.ad_archive_id || region !== "eu") {
        setDetails(null);
        return;
      }

      setDetailsLoading(true);
      setDetailsError(null);

      try {
        const url = `${API_URL}/api/ads/details/${ad.ad_archive_id}`;
        const res = await fetch(url);

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            errData.error || `Failed to load ad details (${res.status})`,
          );
        }

        const data = await res.json();
        console.log("🔍 [AdsModal] Full API response:", data);
        console.log("🔍 [AdsModal] Details object:", data.details);
        
        if (data.success) {
          const detailsData = data.details || null;
          console.log("🔍 [AdsModal] Setting details:", detailsData);
          console.log("🔍 [AdsModal] details.targets_eu:", detailsData?.targets_eu);
          console.log("🔍 [AdsModal] details.eu_total_reach:", detailsData?.eu_total_reach);
          console.log("🔍 [AdsModal] details.location_audience:", detailsData?.location_audience);
          console.log("🔍 [AdsModal] details.age_country_gender_reach_breakdown:", detailsData?.age_country_gender_reach_breakdown);
          setDetails(detailsData);
        } else {
          setDetailsError("Failed to load ad details");
        }
      } catch (err) {
        console.error("Ad details error:", err);
        setDetailsError(err.message || "Failed to load ad details");
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [ad?.ad_archive_id, region]);

  if (!ad) return null;

  const snapshot = ad.snapshot || {};
  const pageName = snapshot.page_name || ad.page_name || "Unknown";
  const adText = snapshot.body?.text || "";
  const images = snapshot.images || snapshot.cards || [];

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
              <h3 className="text-lg font-semibold mb-4">
                Images ({images.length})
              </h3>
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
                    {ad.is_active ? "Active" : "Inactive"}
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
              {ad.publisher_platform &&
                Array.isArray(ad.publisher_platform) && (
                  <div>
                    <p className="text-sm text-gray-500">Platforms</p>
                    <p className="font-medium">
                      {ad.publisher_platform.join(", ")}
                    </p>
                  </div>
                )}
              {ad.categories && Array.isArray(ad.categories) && (
                <div>
                  <p className="text-sm text-gray-500">Categories</p>
                  <p className="font-medium">{ad.categories.join(", ")}</p>
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

          {/* EU Reach / Performance Details (only when region === 'eu') */}
          {region === "eu" && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-2">
                EU Reach & Compliance
              </h3>

              {detailsLoading && (
                <p className="text-sm text-gray-500">Loading EU reach data…</p>
              )}

              {detailsError && (
                <p className="text-sm text-red-600">{detailsError}</p>
              )}

              {!detailsLoading && !detailsError && details && (
                <div className="space-y-4 text-sm">
                  {(() => {
                    console.log("🔍 [AdsModal] Rendering EU section - details:", details);
                    console.log("🔍 [AdsModal] details.targets_eu value:", details.targets_eu);
                    console.log("🔍 [AdsModal] typeof details.targets_eu:", typeof details.targets_eu);
                    console.log("🔍 [AdsModal] details.targets_eu === true:", details.targets_eu === true);
                    console.log("🔍 [AdsModal] details.targets_eu === false:", details.targets_eu === false);
                    return null;
                  })()}
                  {details.targets_eu ? (
                    <>
                      {/* EU Reach Summary */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-3">
                          EU Reach Summary
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {typeof details.eu_total_reach === "number" && (
                            <div>
                              <p className="text-xs text-blue-700 mb-1">
                                Total EU Reach
                              </p>
                              <p className="text-lg font-bold text-blue-900">
                                {details.eu_total_reach.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {details.payer && (
                            <div>
                              <p className="text-xs text-blue-700 mb-1">Payer</p>
                              <p className="text-lg font-semibold text-blue-900">
                                {details.payer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Target Countries */}
                      {Array.isArray(details.location_audience) &&
                        details.location_audience.length > 0 && (
                          <div>
                            <p className="font-medium mb-2">Target Countries</p>
                            <div className="flex flex-wrap gap-2">
                              {details.location_audience.map((loc, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                >
                                  {loc.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Audience Demographics */}
                      {(details.gender_audience || details.age_audience) && (
                        <div>
                          <p className="font-medium mb-2">Audience Demographics</p>
                          <div className="flex flex-wrap gap-4 text-gray-700">
                            {details.gender_audience && (
                              <div>
                                <span className="text-xs text-gray-500">Gender: </span>
                                <span className="font-medium">
                                  {details.gender_audience}
                                </span>
                              </div>
                            )}
                            {details.age_audience && (
                              <div>
                                <span className="text-xs text-gray-500">Age: </span>
                                <span className="font-medium">
                                  {details.age_audience.min || "?"} -{" "}
                                  {details.age_audience.max || "?"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Detailed Breakdown Table */}
                      {Array.isArray(details.age_country_gender_reach_breakdown) &&
                        details.age_country_gender_reach_breakdown.length > 0 && (
                          <div className="mt-4">
                            <p className="font-medium mb-3">
                              Detailed Reach Breakdown by Country, Age & Gender
                            </p>
                            <div className="max-h-96 overflow-auto border border-gray-200 rounded-lg">
                              <table className="min-w-full text-xs">
                                <thead className="bg-gray-50 sticky top-0">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-gray-600 font-semibold border-b">
                                      Country
                                    </th>
                                    <th className="px-3 py-2 text-left text-gray-600 font-semibold border-b">
                                      Age Range
                                    </th>
                                    <th className="px-3 py-2 text-left text-gray-600 font-semibold border-b">
                                      Gender
                                    </th>
                                    <th className="px-3 py-2 text-right text-gray-600 font-semibold border-b">
                                      Reach
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {details.age_country_gender_reach_breakdown.flatMap(
                                    (countryData, countryIdx) => {
                                      const country =
                                        countryData.country ||
                                        countryData.country_code ||
                                        "Unknown";
                                      const breakdowns =
                                        countryData.age_gender_breakdowns || [];

                                      return breakdowns.map((breakdown, breakdownIdx) => {
                                        const rows = [];
                                        if (
                                          typeof breakdown.male === "number" &&
                                          breakdown.male > 0
                                        ) {
                                          rows.push({
                                            country,
                                            age_range: breakdown.age_range || "N/A",
                                            gender: "Male",
                                            reach: breakdown.male,
                                            key: `${countryIdx}-${breakdownIdx}-male`,
                                          });
                                        }
                                        if (
                                          typeof breakdown.female === "number" &&
                                          breakdown.female > 0
                                        ) {
                                          rows.push({
                                            country,
                                            age_range: breakdown.age_range || "N/A",
                                            gender: "Female",
                                            reach: breakdown.female,
                                            key: `${countryIdx}-${breakdownIdx}-female`,
                                          });
                                        }
                                        if (
                                          typeof breakdown.unknown === "number" &&
                                          breakdown.unknown > 0
                                        ) {
                                          rows.push({
                                            country,
                                            age_range: breakdown.age_range || "N/A",
                                            gender: "Unknown",
                                            reach: breakdown.unknown,
                                            key: `${countryIdx}-${breakdownIdx}-unknown`,
                                          });
                                        }
                                        return rows;
                                      });
                                    },
                                  ).flat().map((row) => (
                                    <tr
                                      key={row.key}
                                      className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                      <td className="px-3 py-2 font-medium text-gray-900">
                                        {row.country}
                                      </td>
                                      <td className="px-3 py-2 text-gray-700">
                                        {row.age_range}
                                      </td>
                                      <td className="px-3 py-2 text-gray-700">
                                        {row.gender}
                                      </td>
                                      <td className="px-3 py-2 text-right font-medium text-gray-900">
                                        {row.reach.toLocaleString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                    </>
                  ) : details ? (
                    (() => {
                      console.log("⚠️ [AdsModal] Showing 'no EU data' message");
                      console.log("⚠️ [AdsModal] Condition check - details exists:", !!details);
                      console.log("⚠️ [AdsModal] Condition check - details.targets_eu:", details.targets_eu);
                      console.log("⚠️ [AdsModal] Condition check - details.targets_eu === false:", details.targets_eu === false);
                      console.log("⚠️ [AdsModal] Condition check - details.targets_eu === true:", details.targets_eu === true);
                      console.log("⚠️ [AdsModal] Full details object:", JSON.stringify(details, null, 2));
                      return (
                        <p className="text-gray-500 italic">
                          This ad does not appear to target EU countries, or EU reach
                          data is not available.
                        </p>
                      );
                    })()
                  ) : null}
                </div>
              )}
            </div>
          )}

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
  );
};

export default AdsModal;

import { Router, Request, Response } from "express";
import axios from "axios";
import { AdSearch } from "../models/AdSearch";
import { AdDetails } from "../models/AdDetails";
import { normalizeQuery } from "../utils/queryNormalizer";
import { isMongoConnected } from "../db/connection";

const router = Router();

const SEARCHAPI_BASE_URL = "https://www.searchapi.io/api/v1/search";

// --- GET /ads/search --------------------------------------------------
// Step 1: Search ads via meta_ad_library (cached for 14 days)
router.get("/search", async (req: Request, res: Response) => {
  try {
    const {
      q,
      page_id,
      country,
      ad_type,
      media_type,
      platforms,
      start_date,
      end_date,
      sort_by,
    } = req.query;

    // Normalize query if provided
    const normalizedQuery = q ? normalizeQuery(q as string) : null;
    const cacheKey = page_id
      ? `page_${page_id}`
      : normalizedQuery
        ? `q_${normalizedQuery}`
        : null;

    if (!cacheKey) {
      return res
        .status(400)
        .json({ error: "Either q or page_id parameter is required" });
    }

    // Check cache first (only if MongoDB is connected)
    if (isMongoConnected() && cacheKey) {
      try {
        const cachedResult = await AdSearch.findOne({ cacheKey });

        if (cachedResult) {
          console.log(`Cache hit for: ${cacheKey}`);

          if (!cachedResult.ads || !Array.isArray(cachedResult.ads)) {
            console.warn("Cache data incomplete, fetching from API");
          } else {
            return res.json({
              success: true,
              ads: cachedResult.ads,
              search_information: cachedResult.search_information,
              pagination: cachedResult.pagination,
              ad_library_page_info: cachedResult.ad_library_page_info,
              cached: true,
            });
          }
        }
      } catch (cacheError) {
        console.warn("Cache read error, continuing with API call:", cacheError);
      }
    }

    // Cache miss or MongoDB not available - fetch from API
    console.log(`Cache miss for: ${cacheKey}`);

    const apiKey = process.env.SEARCHAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "SearchAPI key not configured" });
    }

    // Build request params
    const params: any = {
      engine: "meta_ad_library",
      api_key: apiKey,
    };

    if (q) params.q = q as string;
    if (page_id) params.page_id = page_id as string;
    if (country) params.country = country as string;
    if (ad_type) params.ad_type = ad_type as string;
    if (media_type) params.media_type = media_type as string;
    if (platforms) params.platforms = platforms as string;
    if (start_date) params.start_date = start_date as string;
    if (end_date) params.end_date = end_date as string;
    if (sort_by) params.sort_by = sort_by as string;

    const response = await axios.get(SEARCHAPI_BASE_URL, { params });
    const data = response.data;

    if (!data.ads) {
      return res.status(500).json({ error: "Invalid API response" });
    }

    // Save to cache (only if MongoDB is connected)
    if (isMongoConnected()) {
      try {
        await AdSearch.create({
          cacheKey,
          ads: data.ads,
          search_information: data.search_information,
          pagination: data.pagination,
          ad_library_page_info: data.ad_library_page_info,
        });
        console.log(`Saved to cache: ${cacheKey}`);
      } catch (cacheError) {
        console.warn(
          "Cache save error (continuing without cache):",
          cacheError,
        );
      }
    }

    res.json({
      success: true,
      ads: data.ads,
      search_information: data.search_information,
      pagination: data.pagination,
      ad_library_page_info: data.ad_library_page_info,
      cached: false,
    });
  } catch (error: any) {
    console.error("Error fetching ads:", error);
    res.status(500).json({
      error: "Failed to fetch ads",
      message: error.response?.data?.error || error.message,
    });
  }
});

// --- GET /ads/details/:ad_archive_id ----------------------------------
// Step 2: Fetch EU reach details for a specific ad via meta_ad_library_ad_details
router.get("/details/:ad_archive_id", async (req: Request, res: Response) => {
  try {
    const { ad_archive_id } = req.params;

    if (!ad_archive_id) {
      return res
        .status(400)
        .json({ error: "ad_archive_id parameter is required" });
    }

    // Check cache first (no TTL for ad details)
    if (isMongoConnected()) {
      try {
        const cached = await AdDetails.findOne({ ad_archive_id });
        if (cached) {
          console.log(`Ad details cache hit for: ${ad_archive_id}`);
          return res.json({ success: true, details: cached, cached: true });
        }
      } catch (cacheError) {
        console.warn(
          "Ad details cache read error, continuing with API call:",
          cacheError,
        );
      }
    }

    console.log(`Ad details cache miss for: ${ad_archive_id}`);

    const apiKey = process.env.SEARCHAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "SearchAPI key not configured" });
    }

    // Call meta_ad_library_ad_details engine
    const params: any = {
      engine: "meta_ad_library_ad_details",
      api_key: apiKey,
      ad_archive_id,
    };

    const response = await axios.get(SEARCHAPI_BASE_URL, { params });
    const data = response.data;

    console.log("🔍 [Backend] Full SearchAPI.io response for ad_archive_id:", ad_archive_id);
    console.log("🔍 [Backend] Response keys:", Object.keys(data || {}));
    console.log("🔍 [Backend] data.transparency_by_location:", JSON.stringify(data.transparency_by_location, null, 2));
    console.log("🔍 [Backend] data.aaa_info:", JSON.stringify(data.aaa_info, null, 2));

    if (!data) {
      return res.status(500).json({ error: "Invalid ad details API response" });
    }

    // Extract EU-related fields from the actual SearchAPI.io response structure
    // Prefer transparency_by_location.eu_transparency, fallback to aaa_info
    const euTransparency =
      data.transparency_by_location?.eu_transparency || data.aaa_info;
    
    console.log("🔍 [Backend] euTransparency object:", JSON.stringify(euTransparency, null, 2));
    
    const eu_total_reach =
      euTransparency?.eu_total_reach || data.eu_total_reach;
    
    const age_country_gender_reach_breakdown =
      euTransparency?.age_country_gender_reach_breakdown ||
      data.age_country_gender_reach_breakdown ||
      [];
    
    const location_audience =
      euTransparency?.location_audience || data.aaa_info?.location_audience || [];
    
    const gender_audience =
      euTransparency?.gender_audience || data.aaa_info?.gender_audience;
    
    const age_audience =
      euTransparency?.age_audience || data.aaa_info?.age_audience;

    // Extract payer from payer_beneficiary_data
    let payer: string | undefined;
    if (data.aaa_info?.payer_beneficiary_data?.[0]?.payer) {
      payer = data.aaa_info.payer_beneficiary_data[0].payer;
    } else if (data.payer) {
      payer = data.payer;
    }

    // Determine if ad targets EU countries
    let targets_eu = false;
    
    console.log("🔍 [Backend] Checking targets_eu...");
    console.log("🔍 [Backend] euTransparency?.targets_eu:", euTransparency?.targets_eu);
    console.log("🔍 [Backend] data.targets_eu:", data.targets_eu);
    console.log("🔍 [Backend] location_audience:", JSON.stringify(location_audience, null, 2));
    console.log("🔍 [Backend] age_country_gender_reach_breakdown length:", age_country_gender_reach_breakdown?.length);
    
    // Check explicit flag first
    if (typeof euTransparency?.targets_eu === "boolean") {
      targets_eu = euTransparency.targets_eu;
      console.log("🔍 [Backend] Set targets_eu from euTransparency.targets_eu:", targets_eu);
    } else if (typeof data.targets_eu === "boolean") {
      targets_eu = data.targets_eu;
      console.log("🔍 [Backend] Set targets_eu from data.targets_eu:", targets_eu);
    } else {
      // Infer from location_audience or breakdown
      const EU_COUNTRIES = ["DE", "FR", "IT", "ES", "NL", "BE", "PL", "SE"];
      
      if (Array.isArray(location_audience) && location_audience.length > 0) {
        const hasEUCountry = location_audience.some((loc: any) =>
          EU_COUNTRIES.some((code) =>
            loc.name?.toUpperCase().includes(code) ||
            loc.name === "Germany" ||
            loc.name === "France" ||
            loc.name === "Italy" ||
            loc.name === "Spain" ||
            loc.name === "Netherlands" ||
            loc.name === "Belgium" ||
            loc.name === "Poland" ||
            loc.name === "Sweden",
          ),
        );
        targets_eu = hasEUCountry;
        console.log("🔍 [Backend] Inferred targets_eu from location_audience:", targets_eu);
      } else if (Array.isArray(age_country_gender_reach_breakdown)) {
        const hasEUCountry = age_country_gender_reach_breakdown.some((entry: any) =>
          EU_COUNTRIES.includes(entry?.country_code || entry?.country),
        );
        targets_eu = hasEUCountry;
        console.log("🔍 [Backend] Inferred targets_eu from age_country_gender_reach_breakdown:", targets_eu);
      } else {
        console.log("🔍 [Backend] No EU indicators found, targets_eu remains false");
      }
    }
    
    console.log("🔍 [Backend] Final targets_eu value:", targets_eu);

    const detailsDoc = {
      ad_archive_id,
      eu_total_reach,
      age_country_gender_reach_breakdown,
      location_audience,
      gender_audience,
      age_audience,
      targets_eu,
      payer,
    };

    console.log("🔍 [Backend] Final detailsDoc to save:", JSON.stringify(detailsDoc, null, 2));
    console.log("🔍 [Backend] detailsDoc.targets_eu:", detailsDoc.targets_eu);
    console.log("🔍 [Backend] typeof detailsDoc.targets_eu:", typeof detailsDoc.targets_eu);

    // Save details (no TTL)
    if (isMongoConnected()) {
      try {
        await AdDetails.create(detailsDoc);
        console.log(`Saved ad details to cache: ${ad_archive_id}`);
      } catch (cacheError) {
        console.warn(
          "Ad details cache save error (continuing without cache):",
          cacheError,
        );
      }
    }

    res.json({ success: true, details: detailsDoc, cached: false });
  } catch (error: any) {
    console.error("Error fetching ad details:", error);
    res.status(500).json({
      error: "Failed to fetch ad details",
      message: error.response?.data?.error || error.message,
    });
  }
});

export { router as adsRouter };

import { Router, Request, Response } from "express";
import axios from "axios";
import { AdSearch } from "../models/AdSearch";
import { normalizeQuery } from "../utils/queryNormalizer";
import { isMongoConnected } from "../db/connection";

const router = Router();

const SEARCHAPI_BASE_URL = "https://www.searchapi.io/api/v1/search";

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

export { router as adsRouter };

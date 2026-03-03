import { Router, Request, Response } from "express";
import axios from "axios";
import { AdSearch } from "../models/AdSearch";
import { normalizeQuery } from "../utils/queryNormalizer";
import { isMongoConnected } from "../db/connection";

const router = Router();

interface CompanySearchResult {
  page_id: string;
  category: string;
  image_uri: string;
  name: string;
  likes?: number;
  verification?: string;
  [key: string]: any;
}

interface GalleryItem {
  id: string;
  type: "image";
  url: string;
  title: string;
}

router.get("/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Normalize query to prevent duplicate API calls
    const normalizedQuery = normalizeQuery(query);

    // Check cache first (only if MongoDB is connected)
    if (isMongoConnected()) {
      try {
        const cachedResult = await AdSearch.findOne({
          normalizedQuery,
        });

        if (cachedResult) {
          console.log(
            `Cache hit for query: "${query}" (normalized: "${normalizedQuery}")`,
          );

          // Ensure we have valid data
          if (!cachedResult.ads || !cachedResult.search_information) {
            console.warn("Cache data incomplete, fetching from API");
            // Fall through to API call
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
    console.log(
      `Cache miss for query: "${query}" (normalized: "${normalizedQuery}")`,
    );

    const apiKey = process.env.SEARCHAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const response = await axios.get(
      `https://www.searchapi.io/api/v1/search?engine=meta_ad_library&api_key=${apiKey}&q=${encodeURIComponent(query)}`,
      {
        headers: { "x-api-key": apiKey },
      },
    );

    const data = response.data;

    if (!data.ads) {
      return res.status(500).json({ error: "Invalid API response" });
    }

    // Log all available fields from API (for debugging)
    if (data.ads && data.ads.length > 0) {
      console.log("Available fields from API:", Object.keys(data.ads[0]));
    }

    // Save to cache (only if MongoDB is connected)
    if (isMongoConnected()) {
      try {
        await AdSearch.create({
          normalizedQuery,
          ads: data.ads,
          search_information: data.search_information,
          pagination: data.pagination,
          ad_library_page_info: data.ad_library_page_info,
        });
        console.log(`Saved to cache: "${normalizedQuery}"`);
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
      message: error.message,
    });
  }
});

export { router as searchAds };

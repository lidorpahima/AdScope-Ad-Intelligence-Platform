import { Router, Request, Response } from "express";
import axios from "axios";
import { CompanySearch } from "../models/CompanySearch";
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
        const cachedResult = await CompanySearch.findOne({
          normalizedQuery,
        });

        if (cachedResult) {
          console.log(
            `Cache hit for query: "${query}" (normalized: "${normalizedQuery}")`,
          );
          return res.json({
            success: true,
            items: cachedResult.items,
            searchResults: cachedResult.searchResults,
            cached: true,
          });
        }
      } catch (cacheError) {
        console.warn("Cache read error, continuing with API call:", cacheError);
      }
    }

    // Cache miss or MongoDB not available - fetch from API
    console.log(
      `Cache miss for query: "${query}" (normalized: "${normalizedQuery}")`,
    );

    const apiKey = process.env.SCRAPECREATORS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const response = await axios.get(
      `https://api.scrapecreators.com/v1/facebook/adLibrary/search/companies?query=${encodeURIComponent(query)}`,
      {
        headers: { "x-api-key": apiKey },
      },
    );

    const data = response.data;

    if (!data.success || !data.searchResults) {
      return res.status(500).json({ error: "Invalid API response" });
    }

    const galleryItems: GalleryItem[] = data.searchResults.map(
      (result: CompanySearchResult) => ({
        id: result.page_id,
        type: "image" as const,
        url: result.image_uri,
        title: result.name,
      }),
    );

    // Save to cache (only if MongoDB is connected)
    if (isMongoConnected()) {
      try {
        await CompanySearch.create({
          normalizedQuery,
          searchResults: data.searchResults,
          items: galleryItems,
          credits_remaining: data.credits_remaining,
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
      items: galleryItems,
      searchResults: data.searchResults,
      credits_remaining: data.credits_remaining,
      cached: false,
    });
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    res.status(500).json({
      error: "Failed to fetch companies",
      message: error.message,
    });
  }
});

export { router as searchCompanies };

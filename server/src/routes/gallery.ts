import { Router, Request, Response } from 'express';
import axios from 'axios';

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
  type: 'image';
  url: string;
  title: string;
}

router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const apiKey = process.env.SCRAPECREATORS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await axios.get(
      `https://api.scrapecreators.com/v1/facebook/adLibrary/search/companies?query=${encodeURIComponent(query)}`,
      {
        headers: { 'x-api-key': apiKey },
      }
    );

    const data = response.data;

    if (!data.success || !data.searchResults) {
      return res.status(500).json({ error: 'Invalid API response' });
    }

    const galleryItems: GalleryItem[] = data.searchResults.map(
      (result: CompanySearchResult) => ({
        id: result.page_id,
        type: 'image' as const,
        url: result.image_uri,
        title: result.name,
      })
    );

    res.json({
      success: true,
      items: galleryItems,
      credits_remaining: data.credits_remaining,
    });
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      error: 'Failed to fetch companies',
      message: error.message,
    });
  }
});

export { router as searchCompanies };

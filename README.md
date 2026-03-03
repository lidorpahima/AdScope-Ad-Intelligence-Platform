# Upspring.ai - Ads Gallery Platform

Gallery application for searching and viewing Meta Ad Library ads.

## Project Structure

- `client/` - React + Vite + Tailwind frontend
- `server/` - Express.js + TypeScript backend

## Quick Start

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your API key to `.env`:
```
PORT=3001
SEARCHAPI_KEY=your_searchapi_key_here
MONGODB_URI=mongodb://localhost:27017/upspring
```

5. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file if you need to change API URL:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Search for ads by:
   - **Keyword**: Enter a search term (e.g., "nike air")
   - **Page ID**: Enter a specific page ID to see all ads from that page
3. Click on any ad to see full details including:
   - Ad text and images
   - Page information
   - Ad metadata (dates, platforms, categories)
   - Links and call-to-action buttons

## Features

- **Meta Ad Library Integration**: Search ads from Facebook, Instagram, and other Meta platforms
- **Caching**: Search results are cached in MongoDB for 7 days
- **Query Normalization**: Prevents duplicate API calls by normalizing queries
- **TTL Index**: Automatic cleanup of old cache entries after 7 days
- **Rich Ad Display**: View ad images, text, metadata, and links

## API Endpoints

- `GET /health` - Health check
- `GET /api/ads/search?q=nike` - Search ads by keyword
- `GET /api/ads/search?page_id=123456` - Get ads by page ID

## Cache Behavior

- First search for a query/page: Fetches from API and saves to MongoDB
- Subsequent searches (within 7 days): Returns cached results from MongoDB
- After 7 days: Cache expires automatically, next search fetches from API again

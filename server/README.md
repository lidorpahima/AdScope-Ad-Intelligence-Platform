# Upspring Server

Express.js + TypeScript backend server for the gallery application with MongoDB caching.

## Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running locally, or use MongoDB Atlas

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure `.env`:
```
PORT=3001
SCRAPECREATORS_API_KEY=your_api_key_here
MONGODB_URI=mongodb://localhost:27017/upspring
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/upspring
```

## Features

- **Caching**: Search results are cached in MongoDB for 7 days
- **Query Normalization**: Prevents duplicate API calls by normalizing queries (lowercase, trim spaces)
- **TTL Index**: Automatic cleanup of old cache entries after 7 days

## Run

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/gallery/search?query=nike` - Search for companies (cached for 7 days)

## Cache Behavior

- First search for a query: Fetches from API and saves to MongoDB
- Subsequent searches (within 7 days): Returns cached results from MongoDB
- After 7 days: Cache expires automatically, next search fetches from API again

# Upspring.ai - Gallery Platform

Gallery application with company search functionality.

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
SCRAPECREATORS_API_KEY=your_api_key_here
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
2. Enter a company name in the search field (e.g., "nike")
3. Click "Search" to see company images/ads
4. Results will be displayed in a responsive grid layout

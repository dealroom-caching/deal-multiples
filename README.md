# Deal Multiples Data Cache

This folder contains automatically updated cache data for deal multiples from Google Sheets CSV.

## How it works

1. **GitHub Action** runs daily at 3 AM UTC
2. **Fetches fresh CSV data** from Google Sheets export URL
3. **Updates cache files** in `public/cached-data/`
4. **Commits changes** back to the repository

## Files

- `deals.csv` - Main CSV file with deal multiples data
- `deals-metadata.json` - Metadata with timestamp and update information
- `fetch-deals-data.js` - Script to fetch and update cache data
- `.github/workflows/refresh-deals-cache.yml` - GitHub Action workflow

## Manual Update

You can manually trigger a cache update:

1. Go to the "Actions" tab in GitHub
2. Click "Auto-refresh Deals CSV cache" 
3. Click "Run workflow"

## Data Structure

The CSV contains deal multiples data with columns like:
- round_id, deal_description, multiple_type
- company information (name, industry, etc.)
- valuation and financial metrics
- investor details
- EV/revenue and EV/EBITDA multiples

## Metadata Structure

The metadata file contains tracking information with a unique retrieval ID to ensure fresh commits. The CSV file includes a retrieval marker at the end to guarantee git detects changes:

```json
{
  "lastUpdated": "2025-09-22T16:47:40.340Z",
  "timestamp": 1758559660340,
  "retrievalId": "82fba3fa-7fec-4350-8438-032f70974bc7",
  "source": "Google Sheets CSV",
  "url": "https://docs.google.com/...",
  "dataLength": 14953104,
  "finalFileSize": 14953186
}
```

## Access

The cache files are publicly accessible via GitHub raw files:
- `https://raw.githubusercontent.com/dealroom-caching/deal-multiples/main/public/cached-data/deals.csv`
- `https://raw.githubusercontent.com/dealroom-caching/deal-multiples/main/public/cached-data/deals-metadata.json`

## Time Validation

Use the timestamp in the metadata file to implement time-based validation (e.g., 26-hour cache expiry) in your applications.


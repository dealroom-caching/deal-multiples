import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Google Sheets CSV URL
const CSV_URL = "https://docs.google.com/spreadsheets/d/10qd9IhTdrq_vZzGFDkwxcio8hH48LZu9npaWespygTs/export?format=csv&gid=806431249&single=true&output";

async function fetchDealsCSV() {
  console.log('🔄 Fetching fresh deals data from Google Sheets...');
  
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('Empty CSV data received');
    }
    
    console.log(`✅ Successfully fetched CSV data (${csvText.length} characters)`);
    return csvText;
    
  } catch (error) {
    console.error(`❌ Failed to fetch CSV data:`, error.message);
    throw error;
  }
}

async function main() {
  try {
    // Create cache directory
    const cacheDir = path.join(process.cwd(), 'public', 'cached-data');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    // Fetch CSV data
    const csvData = await fetchDealsCSV();
    
    // Add metadata to track when the data was updated
    const metadata = {
      lastUpdated: new Date().toISOString(),
      timestamp: Date.now(),
      retrievalId: crypto.randomUUID(), // Unique ID for each retrieval
      source: 'Google Sheets CSV',
      url: CSV_URL,
      dataLength: csvData.length
    };
    
    // Check if CSV content has changed
    const csvFilePath = path.join(cacheDir, 'deals.csv');
    let contentChanged = true;
    if (fs.existsSync(csvFilePath)) {
      const existingCsv = fs.readFileSync(csvFilePath, 'utf8');
      contentChanged = existingCsv !== csvData;
      console.log(`📊 Content comparison: ${contentChanged ? 'Data has changed' : 'Data is identical to existing file'}`);
    }
    
    // Save CSV file with retrieval marker to ensure git always detects changes
    const csvWithMarker = csvData + `\n# Retrieved: ${metadata.lastUpdated} | ID: ${metadata.retrievalId}\n`;
    fs.writeFileSync(csvFilePath, csvWithMarker);
    
    // Update metadata to reflect the final file size including marker
    metadata.finalFileSize = csvWithMarker.length;
    
    // Save metadata as JSON
    const metadataFilePath = path.join(cacheDir, 'deals-metadata.json');
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
    
    // Force update file timestamps to ensure git sees them as changed
    const now = new Date();
    fs.utimesSync(csvFilePath, now, now);
    fs.utimesSync(metadataFilePath, now, now);
    
    console.log('🔄 Files updated with fresh timestamps and unique retrieval ID');
    
    console.log(`\n✅ Cache updated successfully!`);
    console.log(`📁 CSV file: ${csvFilePath}`);
    console.log(`📁 Metadata: ${metadataFilePath}`);
    console.log(`📊 Data size: ${csvData.length} characters`);
    console.log(`🔄 Content changed: ${contentChanged ? 'Yes' : 'No'}`);
    console.log(`🕒 Timestamp: ${metadata.lastUpdated}`);
    
  } catch (error) {
    console.error('❌ Cache update failed:', error);
    process.exit(1);
  }
}

main();


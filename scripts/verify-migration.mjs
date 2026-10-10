import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      if (key === 'FIREBASE_PRIVATE_KEY') {
        val = val.replace(/\\n/g, '\n');
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const { admin } = await import('../lib/firebase-admin.ts');
const db = admin.database();

async function run() {
  // Total count of date keys under stats/page_views.
  const pageViewsSnap = await db.ref('stats/page_views').once('value');
  const pageViews = pageViewsSnap.val() || {};
  console.log('Total count of date keys under stats/page_views:', Object.keys(pageViews).length);

  // Value of stats/page_views/2026-05-21/total
  const val0521 = await db.ref('stats/page_views/2026-05-21/total').once('value');
  console.log('Value of stats/page_views/2026-05-21/total:', val0521.val());

  // Value of stats/page_views/2026-06-01/total (must be 19)
  const val0601 = await db.ref('stats/page_views/2026-06-01/total').once('value');
  console.log('Value of stats/page_views/2026-06-01/total:', val0601.val());

  // Does stats/visits still exist?
  const visitsSnap = await db.ref('stats/visits').once('value');
  console.log('Does stats/visits still exist?:', visitsSnap.exists());

  // Any date under stats/page_views still containing non-counter keys
  const badDates = [];
  for (const [date, data] of Object.entries(pageViews)) {
    for (const key of Object.keys(data)) {
      if (key !== 'total' && key !== 'sources' && key !== 'pages') {
        badDates.push({ date, badKey: key });
      }
    }
  }
  console.log('Dates with non-counter keys:', badDates.length === 0 ? 'None' : JSON.stringify(badDates));

  // Does rate_limits/test_active_keep_me still exist?
  const rlSnap = await db.ref('rate_limits/test_active_keep_me').once('value');
  console.log('Does rate_limits/test_active_keep_me still exist?:', rlSnap.exists());

  process.exit(0);
}

run().catch(console.error);

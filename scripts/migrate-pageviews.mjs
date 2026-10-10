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

const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_DATABASE_URL'
];
const missing = requiredEnvVars.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const { admin } = await import('../lib/firebase-admin.ts');

const db = admin.database();

function sanitize(str, maxLen, defaultVal) {
  if (typeof str !== 'string' || !str.trim()) return defaultVal;
  let s = str.toLowerCase();
  s = s.replace(/^\//, ''); // strip leading /
  s = s.replace(/\//g, '_'); // replace / with _
  s = s.replace(/[^a-z0-9_-]/g, '_'); // anything not in [a-z0-9_-] to _
  return s.substring(0, maxLen) || defaultVal;
}

async function migrate() {
  console.log('Fetching database stats...');
  const statsRef = db.ref('stats');
  const snapshot = await statsRef.once('value');
  const data = snapshot.val() || {};
  
  const visits = data.visits || {};
  const pageViews = data.page_views || {};

  let grandTotalWritten = 0;

  console.log('date | source archive | push-id count | total written | sources keys | pages keys');
  console.log('----------------------------------------------------------------------------------');

  let stepAErrors = 0;

  // Step A - Seed May totals from stats/visits
  for (const date of Object.keys(visits).sort()) {
    if (date === '2026-06-01') continue;

    const count = Object.keys(visits[date] || {}).length;
    
    // Idempotency: skip if already has total number
    if (pageViews[date] && typeof pageViews[date].total === 'number') {
      console.warn(`[WARN] Skipping ${date} (Step A): already has total.`);
      continue;
    }

    try {
      await db.ref(`stats/page_views/${date}`).update({ total: count });
      grandTotalWritten += count;
      console.log(`${date} | visits | ${count} | ${count} | 0 | 0`);
    } catch (err) {
      console.error(`Failed to write date ${date}`, err);
      stepAErrors++;
    }
  }

  if (Object.keys(visits).length > 0) {
    if (stepAErrors === 0) {
      try {
        await db.ref('stats/visits').remove();
        console.log('Successfully deleted stats/visits after Step A.');
      } catch (err) {
        console.error('Failed to delete stats/visits after Step A:', err);
      }
    } else {
      console.warn(`[WARN] Skipping deletion of stats/visits due to ${stepAErrors} errors in Step A.`);
    }
  }

  // Step B - Aggregate rich push IDs
  for (const date of Object.keys(pageViews).sort()) {
    if (date === '2026-10-10') {
      const children = pageViews[date] || {};
      const pushIdKeys = Object.keys(children).filter(k => k !== 'total' && k !== 'sources' && k !== 'pages');
      
      if (pushIdKeys.length > 0) {
        console.log(`Cleaning up ${pushIdKeys.length} stale push IDs on 2026-10-10...`);
        for (const pushId of pushIdKeys) {
          try {
            await db.ref(`stats/page_views/${date}/${pushId}`).remove();
          } catch (err) {
            console.error(`Failed to remove push ID ${pushId} on 2026-10-10`, err);
          }
        }
      }
      continue;
    }

    const children = pageViews[date] || {};
    
    // Idempotency
    if (typeof children.total === 'number') {
      console.warn(`[WARN] Skipping ${date} (Step B): already has total.`);
      continue;
    }

    let dailyTotal = 0;
    const sources = {};
    const pages = {};
    const pushIdKeys = [];
    
    for (const key of Object.keys(children)) {
      if (key === 'total' || key === 'sources' || key === 'pages') continue;

      const child = children[key];
      // Safety: shape check
      if (child === null || child === undefined) {
          console.warn(`[WARN] Skipping child ${key} on date ${date}: null/undefined`);
          continue;
      }
      pushIdKeys.push(key);
      dailyTotal += 1;
      
      const sourceRaw = typeof child === 'object' ? child.source : null;
      const landingPageRaw = typeof child === 'object' ? child.landingPage : null;
      
      const source = sanitize(sourceRaw, 40, 'direct___other');
      sources[source] = (sources[source] || 0) + 1;
      
      const pageKey = sanitize(landingPageRaw, 60, 'home');
      pages[pageKey] = (pages[pageKey] || 0) + 1;
    }

    if (pushIdKeys.length > 0) {
      const updatePayload = {};
      updatePayload['total'] = dailyTotal;
      for (const [src, count] of Object.entries(sources)) {
        updatePayload[`sources/${src}`] = count;
      }
      for (const [pg, count] of Object.entries(pages)) {
        updatePayload[`pages/${pg}`] = count;
      }

      try {
        // Atomic update per date
        await db.ref(`stats/page_views/${date}`).update(updatePayload);
        grandTotalWritten += dailyTotal;
        
        console.log(`${date} | page_views | ${pushIdKeys.length} | ${dailyTotal} | ${Object.keys(sources).length} | ${Object.keys(pages).length}`);
        
        // After counters are written, delete push-ID children for that date
        for (const pushId of pushIdKeys) {
          await db.ref(`stats/page_views/${date}/${pushId}`).remove();
        }
      } catch (err) {
         console.error(`Failed to process date ${date}`, err);
      }
    }
  }

  console.log('----------------------------------------------------------------------------------');
  console.log(`Grand Totals Written: ${grandTotalWritten}`);

  // Part 3 - Cleanup
  try {
    await db.ref('rate_limits/test_active_keep_me').remove();
    console.log('Deleted rate_limits/test_active_keep_me');
  } catch (err) {
    console.warn('Failed to delete test_active_keep_me', err);
  }

  console.log('Migration complete.');
}

migrate()
  .then(() => process.exit(0))
  .catch(e => {
    console.error('Migration failed:', e);
    process.exit(1);
  });
